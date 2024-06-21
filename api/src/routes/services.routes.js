import { Router } from "express";
import Busboy from "busboy";
import { uploadToS3, deleteFileS3 } from "../services/aws.js";
import Service from "../models/services.js";
import File from "../models/file.js";

const router = Router();

const uploadFiles = async (req) => {
  let errors = [];
  let arquivos = [];

  if (req.files && Object.keys(req.files).length > 0) {
    for (let key of Object.keys(req.files)) {
      const file = req.files[key];

      const nameParts = file.name.split(".");
      const fileName = `${new Date().getTime()}.${
        nameParts[nameParts.length - 1]
      }`;
      const path = `servicos/${req.body.salaoId}/${fileName}`;

      const response = await uploadToS3(file, path);

      if (response.error) {
        errors.push({ error: true, message: response.message.message });
      } else {
        arquivos.push(path);
      }
    }
  }

  return { errors, arquivos };
};

const createServico = async (req, res) => {
  var busboy = new Busboy({ headers: req.headers });
  busboy.on("finish", async () => {
    try {
      const { errors, arquivos } = await uploadFiles(req);

      if (errors.length > 0) {
        res.json(errors[0]);
        return;
      }

      let jsonServico = JSON.parse(req.body.servico);
      jsonServico.salaoId = req.body.salaoId;
      const servico = await new Service(jsonServico).save();

      const arquivosData = arquivos.map((arquivo) => ({
        referenciaId: servico._id,
        model: "Servico",
        arquivo,
      }));
      await File.insertMany(arquivosData);

      res.json({ error: false, arquivos });
    } catch (err) {
      res.json({ error: true, message: err.message });
    }
  });
  req.pipe(busboy);
};

const updateServico = async (req, res) => {
  var busboy = new Busboy({ headers: req.headers });
  busboy.on("finish", async () => {
    try {
      const { errors, arquivos } = await uploadFiles(req);

      if (errors.length > 0) {
        res.json(errors[0]);
        return;
      }

      let jsonServico = JSON.parse(req.body.servico);
      await Service.findByIdAndUpdate(req.params.id, jsonServico);

      const arquivosData = arquivos.map((arquivo) => ({
        referenciaId: req.params.id,
        model: "Servico",
        arquivo,
      }));
      await File.insertMany(arquivosData);

      res.json({ error: false });
    } catch (err) {
      res.json({ error: true, message: err.message });
    }
  });
  req.pipe(busboy);
};

const getServicosBySalaoId = async (req, res) => {
  try {
    let servicosSalao = [];
    const servicos = await Service.find({
      salaoId: req.params.salaoId,
      status: { $ne: "E" },
    });

    for (let servico of servicos) {
      const arquivos = await File.find({
        model: "Servico",
        referenciaId: servico._id,
      });
      servicosSalao.push({ ...servico._doc, arquivos });
    }

    res.json({
      error: false,
      servicos: servicosSalao,
    });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

const removeArquivo = async (req, res) => {
  try {
    const { arquivo } = req.body;

    await deleteFileS3(arquivo);
    await File.findOneAndDelete({ arquivo });

    res.json({ error: false, message: "Erro ao excluir o arquivo!" });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

const deleteServico = async (req, res) => {
  try {
    await Service.findByIdAndUpdate(req.params.id, { status: "E" });
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

router.post("/", createServico);
router.put("/:id", updateServico);
router.get("/salao/:salaoId", getServicosBySalaoId);
router.post("/remove-arquivo", removeArquivo);
router.delete("/:id", deleteServico);

export default router;
