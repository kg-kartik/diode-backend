import express from "express";
import { requireLogin } from "src/middlewares/requireLogin";
import { createInstance, selectRepo, signup } from "../controllers/Users";
const router = express.Router();

router.post("/signup", signup);
router.post("/createInstance", createInstance);
router.post("/selectRepo", selectRepo);

export default router;
