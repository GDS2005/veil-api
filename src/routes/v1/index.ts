import { Router } from "express";
import { register } from "../../controller/user.controller.js";

const router = Router();

router.get("/test", register);

export default router;