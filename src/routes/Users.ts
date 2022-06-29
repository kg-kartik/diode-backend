import express from "express";
import { requireLogin } from "src/middlewares/requireLogin";
import { createInstance, getInstances, signup } from "../controllers/Users";
const router = express.Router();

router.post("/signup", signup);
router.post("/createInstance", createInstance);
router.post("/getInstances", getInstances);

export default router;
