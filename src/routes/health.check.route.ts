import express from "express";

const router = express.Router();

router.get("/", (req, res) =>
  res.status(200).send("<h1>Hey! This is Data Management API.</h1>")
);

export default router;
