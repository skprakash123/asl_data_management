export interface IGCPService {
  downloadFilesFromBucket(bucketName:string ,remoteFilePath:string, localFilePath:string): Promise<any>
}
