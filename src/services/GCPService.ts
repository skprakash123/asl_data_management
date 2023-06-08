import { InternalServerError } from "../errors/InternalServerError";
import { IGCPService } from "../interfaces/IGCPService";
import { Storage } from "@google-cloud/storage";
import { PubSub } from "@google-cloud/pubsub";
import env from "../config/env";
import { injectable } from "inversify";

const storage = new Storage(env.GCP_CONFIG);
const bucketName = env.GCP_BUCKET_NAME;
const gcs = storage.bucket(bucketName!);
const pubsub = new PubSub(env.GCP_CONFIG);

@injectable()
export class GCPService implements IGCPService {
  constructor() {
    console.log(`Creating: ${this.constructor.name}`);
  }  
   async downloadFilesFromBucket(bucketName:string ,remoteFilePath:string, localFilePath:string): Promise<any>{
    try {
      const bucket = storage.bucket(bucketName!);
      const RemoteLocation = gcs.file(remoteFilePath);
      console.log("local file path in downloadfiles - ",localFilePath)
      await RemoteLocation.download({ destination: localFilePath });
      return true;
    } catch (error) {
      throw new InternalServerError(
        "An error occurred while interacting with the downloadFilesFromBucket service." +
          error
      );
    }
  }
}



