import {
    CodeGuruReviewerClient, CreateCodeReviewCommand,
    DescribeCodeReviewCommand,
    ListRecommendationsCommand } from '@aws-sdk/client-codeguru-reviewer';
import { updateCodeReviewARN } from '../mongodb/projects';
import { addRecommendation } from '../mongodb/files';
import dotenv from "dotenv";
dotenv.config();

const associationArn = process.env.ASSOCIATION_ARN ?? "association-arn";
const config = {
    region: process.env.REGION ?? "ap-southeast-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID ?? "access-key-id",
        secretAccessKey: process.env.SECRET_ACCESS_KEY ?? "secret-access-key"
    }
}

const cgClient = new CodeGuruReviewerClient(config);

export const initiateCodeReview = async (projectId: string): Promise<boolean> => {
    const ObjectKey = `${process.env.REPOSITORY_NAME}/${projectId}/source.zip`;
    const input = {
        Name: `${Date.now()}-review`,
        RepositoryAssociationArn: associationArn ?? "association-arn",
        "Type": {
            "AnalysisTypes": ["Security", "CodeQuality"],
            "RepositoryAnalysis": {
                "S3BucketRepository": {
                    "Details": {
                        "BucketName": process.env.S3_BUCKET_NAME ?? "s3-bucket",
                        "CodeArtifacts": {
                            "SourceCodeArtifactsObjectKey": ObjectKey,
                        }
                    },
                    "Name": process.env.REPOSITORY_NAME ?? "s3-repository",
                }
            }
        }
    }
    const data = new CreateCodeReviewCommand(input);
    try {
        const response = await cgClient.send(data);
        const arn = response.CodeReview.CodeReviewArn;
        await updateCodeReviewARN(projectId, arn);
        return true;
    } catch (error){
        console.log(error);
        return false;
    }

}

export const checkCodeReviewStatus = async(codeReviewARN: string) 
    : Promise<false | "pending" | "completed"> => {
    const input = {
        CodeReviewArn: codeReviewARN,
    }
    try {
        const data = new DescribeCodeReviewCommand(input);
        const response = await cgClient.send(data);
        if(response.CodeReview?.State === "Completed"){
            return "completed";
        } else if(response.CodeReview?.State === "Pending"){
            return "pending";
        } else {
            return false;
        }
    } catch (error){
        return false;
    }
}

export const getRecommendations = async(projectId: string, codeReviewARN: string)
: Promise<boolean> => {
    const input = {
        CodeReviewArn: codeReviewARN,
    }
    try {
        const data = new ListRecommendationsCommand(input);
        const response = await cgClient.send(data);
        if(!response.RecommendationSummaries){
            return false;
        }
        // Mapping
        for(let i: number = 0; i < response.RecommendationSummaries?.length; i++){
            const record = response.RecommendationSummaries[i];
            const desc = record.Description.split("").join("");
            const recommend = `In Line ${record.StartLine}: ${record.Description.replace(/\+/g, "")}`;
            const fileName = record.FilePath?.split("/").pop();
            if(!fileName){
                return false;
            }
            const add = await addRecommendation(projectId, fileName, recommend);
            if(!add){
                return false;
            }
        }
        return true;
    } catch (error){
        console.log(error);
        return false;
    }
}
