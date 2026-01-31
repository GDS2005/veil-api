import { Router } from "express";

const router = Router();

router.get("/test", (req, res) => {
  res.json({ message: "API v1 OK" });
});

export default router;