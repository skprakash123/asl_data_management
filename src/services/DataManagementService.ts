import { inject, injectable } from "inversify";
import { IDataManagementService } from "../interfaces/IDataManagementService";
import { InternalServerError } from "../errors/InternalServerError";
import * as path from "path";
import env from "../config/env";
import { IGCPService } from "../interfaces/IGCPService";
import { TYPES } from "../config/types";
import { Documents } from "db-sdk/dist/Documents";
import { DocumentAuditTrail } from "db-sdk/dist/DocumentAuditTrail";
import { FileStatusEnum } from "db-sdk/dist/Enum";
import { Database } from "db-sdk/dist";
// const fs = require('fs');
import fs from "fs";

@injectable()
export class DataManagementService implements IDataManagementService {
  private _gcpService: IGCPService;
  constructor(@inject(TYPES.GCPService) gcpService: IGCPService) {
    this._gcpService = gcpService;
  }

  async queueListen(payload: any): Promise<any> {
    // const db = new Database();
    // let connection;
    // if (typeof connection === "undefined") {
    //   // Connect to the MySQL database from layer
    //   connection = await db.createDBconnection();
    // }
    try {
      const message = payload;
      console.log("message", message);
      if (message) {
        const buffer = Buffer.from(message.data, "base64").toString();
        const data = JSON.parse(buffer!);
        console.log(data, " this is data pack");

        // const parentDirectory = path.join(
        //   __dirname,
        //   "../../../../mnt/akhildnt"
        // );
        const directoryPath = path.join(
          __dirname,
          "../../../../../mnt/FlightData",
          `${data.country}`,
          `${data.folderName}`
        );
        await fs.mkdirSync(directoryPath, { recursive: true });

        console.log("Directory created:", directoryPath);
        const parentDirectory = path.join(
          __dirname,
          `../../../../../mnt/FlightData/${data.country}/${data.folderName}`
        );
        const allfilesDirectory = path.join(parentDirectory);
        console.log(
          allfilesDirectory,
          "this is the directory where the files will be mounted"
        );

        const bucketName = env.GCP_BUCKET_NAME!;
        const remotePath = data.fileLocation.split(bucketName + "/")[1];
        console.log(remotePath, "remotePath");
        console.log(data.fileName, "This is data.fileName");

        const localFilePath = `${allfilesDirectory}/${data.fileName}`;
        console.log(localFilePath, "this is my locall filepath");

        await this._gcpService.downloadFilesFromBucket(
          bucketName,
          remotePath,
          localFilePath
        );

        console.log("Ack Message", message.messageId);

        // const documentEntity: any = await db.getEntity(Documents);
        // const documentAuditTrailEntity: any = await db.getEntity(
        //   DocumentAuditTrail
        // );
        // const document = await documentEntity.findOne({
        //   where: {
        //     id: data.id,
        //   },
        // });
        // console.log(document, "this is document findone clause")
        // try {
        //   const currentTime = new Date()
        //   console.log(currentTime , "this is current time");
        //   // update file status in document table
        //   document.status = FileStatusEnum["SENT_TO_DEST"];
        //   document.processEndTime = currentTime
        //   console.log(document.processEndTime, 'this is document.pet')
        //   await documentEntity.save(document);

        //   // create file status record in document audit table
        //   const documentAuditTrail = new DocumentAuditTrail();
        //   documentAuditTrail.status = FileStatusEnum["SENT_TO_DEST"];
        //   documentAuditTrail.documentId = data.id;
        //   documentAuditTrail.description = "Queue is successfully completed. ";
        //   documentAuditTrail.time = currentTime;
        //   await db.saveEntity(documentAuditTrailEntity, documentAuditTrail);
        //   // return res.status(200).json({ messageId: message.messageId, data: data });

        //   document.status = FileStatusEnum["QUEUE_SUCCESS"];

        //   await documentEntity.save(document);

        //   // create file status record in document audit table
        //   const documentAuditTrails = new DocumentAuditTrail();
        //   documentAuditTrails.status = FileStatusEnum["QUEUE_SUCCESS"];
        //   documentAuditTrails.documentId = data.id;
        //   documentAuditTrails.description = "Queue is successfully completed. ";
        //   documentAuditTrails.time = new Date();
        //   await db.saveEntity(documentAuditTrailEntity, documentAuditTrails);

        //   return data;
        // } catch (error) {

        //   document.status = FileStatusEnum["FAILED"];
        //   await documentEntity.save(document);

        //   // create file status = FAILED record in document audit table
        //   const documentAuditTrail = new DocumentAuditTrail();
        //   documentAuditTrail.status = FileStatusEnum["FAILED"];
        //   documentAuditTrail.documentId = data.id;
        //   documentAuditTrail.description = "Incase of any failure";
        //   documentAuditTrail.time = new Date();
        //   await db.saveEntity(documentAuditTrailEntity, documentAuditTrail);

        //   throw new InternalServerError(
        //     "An error occurred while interacting with the fileManager service." +
        //       error
        //   );
        // }
      }
    } catch (error) {
      throw new InternalServerError(
        "An error occurred while interacting with Queue" + error
      );
    }
  }
}
