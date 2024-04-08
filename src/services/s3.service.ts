import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const config = {
    region: process.env.REGION ?? "ap-southeast-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID ?? "access-key-id",
        secretAccessKey: process.env.SECRET_ACCESS_KEY ?? "secret-access-key"
    }
}

const s3Client = new S3Client(config);

export const uploadToS3 = async (projectId: string): Promise<boolean> => {
    const path = `${process.env.STORAGE_UNIT}/${projectId}/source.zip`;
    try {
        const fileData = fs.readFileSync(path);
        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME ?? "s3-bucket-name",
            Key: `${process.env.REPOSITORY_NAME}/${projectId}/source.zip`,
            Body: fileData,
            ContentType: "application/zip",
        });
        try{
            await s3Client.send(command);
            console.log("Zip uploaded successfully");
            return true;
        } catch (error){
            console.log(error);
            return false;
        }
    } catch (error){
        return false;
    }
}
