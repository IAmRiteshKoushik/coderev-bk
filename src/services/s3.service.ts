import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const config = {
    region: process.env.REGION ?? "ap-southeast-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID ?? "access-key-id",
        secretAccessKey: process.env.SECRET_ACCESS_KEY ?? "secret-access-key"
    }
}

const s3Client = new S3Client(config);

export const uploadToS3 = async (projectId: string, fileName: string, 
    pathToZip: string): Promise<boolean> => {
    try {
        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME ?? "s3-bucket-name",
            Key: `${projectId}/${fileName}`,
            Body: pathToZip,
        });
        await s3Client.send(command);
        return true;
    } catch (error){
        // Setup logs for error
        return false;
    }
}
