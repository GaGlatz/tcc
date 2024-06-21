import { Router } from "express";
import Time from "../models/time.js";
import ServiceCollaborator from "../models/relationship/service-collaborator.js";
import lodash from "lodash";

const router = Router();

const createHorario = async (req, res) => {
  try {
    await new Time(req.body).save();
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

const getHorariosBySalaoId = async (req, res) => {
  try {
    const { salaoId } = req.params;
    const horarios = await Time.find({ salaoId });
    res.json({ error: false, horarios });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

const updateHorario = async (req, res) => {
  try {
    const { horarioId } = req.params;
    const horario = req.body;
    await Time.findByIdAndUpdate(horarioId, horario);
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

const getColaboradores = async (req, res) => {
  try {
    const colaboradores = await ServiceCollaborator.find({
      servicoId: { $in: req.body.servicos },
      status: "A",
    })
      .populate("colaboradorId", "nome")
      .select("colaboradorId -_id");

    const listaColaboradores = lodash
      .uniqBy(colaboradores, (c) => c.colaboradorId._id.toString())
      .map((c) => ({
        label: c.colaboradorId.nome,
        value: c.colaboradorId._id,
      }));

    res.json({ error: false, colaboradores: listaColaboradores });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

const deleteHorario = async (req, res) => {
  try {
    const { horarioId } = req.params;
    await Time.findByIdAndDelete(horarioId);
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

router.post("/", createHorario);
router.get("/salao/:salaoId", getHorariosBySalaoId);
router.put("/:horarioId", updateHorario);
router.post("/colaboradores", getColaboradores);
router.delete("/:horarioId", deleteHorario);

export default router;
