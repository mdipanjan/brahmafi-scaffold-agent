import express, { Router } from "express";
import { chat } from "../controller";

const router: Router = express.Router();

router.post("/chat", chat);

export default router;
