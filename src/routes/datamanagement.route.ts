import express from "express";
import { TYPES } from "../config/types";
import { iocContainer as Container } from "../config/container";
import { IDataManagementService } from "../interfaces/IDataManagementService";
import DataManagementController from "../controllers/DataManagementController";

const router = express.Router();

const dataManagementService = Container.get<IDataManagementService>(
  TYPES.DataManagementService
);

const dataManagementController = new DataManagementController(
  dataManagementService
);

router.post("/listen", (req, res) =>
  dataManagementController.queueListen(req, res)
);

export default router;
