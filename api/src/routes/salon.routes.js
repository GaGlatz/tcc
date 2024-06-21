import { Router } from "express";
import Salon from "../models/salon.js";
import Services from "../models/services.js";
import Time from "../models/time.js";
import { getPreciseDistance } from "geolib";
import { isOpened as _isOpened } from "../util.js";

const router = Router();

const createSalon = async (req, res) => {
  try {
    const salon = await new Salon(req.body).save();
    res.json({ salon });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

const getServicosBySalonId = async (req, res) => {
  try {
    const { salonId } = req.params;
    const servicos = await Services.find({
      salonId,
      status: "A",
    }).select("_id titulo");

    res.json({
      error: false,
      servicos: servicos.map((s) => ({ label: s.titulo, value: s._id })),
    });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

const filterSalonById = async (req, res) => {
  try {
    const salon = await Salon.Services.findById(req.params.id).select(
      req.body.fields
    );

    const distance = getPreciseDistance(
      {
        latitude: salon.geo.coordinates[1],
        longitude: salon.geo.coordinates[0],
      },
      { latitude: -30.043858, longitude: -51.103487 }
    );

    const horarios = await Time.Services.find({
      salonId: req.params.id,
    }).select("dias inicio fim");

    const isOpened = await _isOpened(horarios);

    res.json({
      error: false,
      salon: { ...salon._doc, distance: distance.toFixed(2), isOpened },
    });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
};

router.post("/", createSalon);
router.get("/servicos/:salonId", getServicosBySalonId);
router.post("/filter/:id", filterSalonById);

export default router;
