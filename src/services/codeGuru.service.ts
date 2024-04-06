import {
    CodeGuruReviewerClient,
    CreateCodeReviewCommand,
    CreateCodeReviewCommandInput,
    DescribeCodeReviewCommand,
    ListRecommendationsCommand
} from '@aws-sdk/client-codeguru-reviewer';

const associationArn = process.env.ASSOCIATION_ARN ?? "association-arn";

const config = {
    region: process.env.REGION ?? "ap-southeast-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID ?? "access-key-id",
        secretAccessKey: process.env.SECRET_ACCESS_KEY ?? "secret-access-key"
    }
}


export const backupCreateCodeReview = async () => {

    const cgClient = new CodeGuruReviewerClient(config);
    const ObjectKey = `${process.env.REPOSITORY_NAME}/source.zip`;
    const input: CreateCodeReviewCommandInput = {
        Name: `${new Date(Date.now())}-review`,
        RepositoryAssociationArn: process.env.ASSOCIATION_ARN ?? "association-arn",
        "Type": {
            "AnalysisTypes": ["Security", "CodeQuality"],
            "RepositoryAnalysis": {
                "S3BucketRepository": {
                    "Details": {
                        "BucketName": process.env.S3_BUCKET_NAME ?? "s3-bucket",
                        "CodeArtifacts": {
                            "SourceCodeArtifactObjectKey": ObjectKey,
                        }
                    },
                    "Name": process.env.REPOSITORY_NAME ?? "s3-repository",
                }
            }
        }
    }
    const data = new CreateCodeReviewCommand(input);
    const response = await cgClient.send(data);
    console.log(response);

}


// const initiateCodeReview = async (zipFileName: string, projectId: string, 
//     fileName: string) => {
//     const ObjectKey = `${projectId}/${fileName}`
//
//     // CreateCodeReview request
//     const input = {
//         Name: `${}`,
//         RepositoryAssociationArn: process.env.ASSOCIATION_ARN ?? "association-arn",
//         "Type": {
//             "AnalysisTypes": ["Security", "CodeQuality"],
//             "RepositoryAnalysis": {
//                 "S3BucketRepository": {
//                     "Details": {
//                         "BucketName": process.env.S3_BUCKET_NAME ?? "s3-bucket",
//                         "CodeArtifacts": {
//                             "SourceCodeArtifactObjectKey": ObjectKey,
//                         }
//
//                     },
//                     "Name": process.env.S3_REPOSITORY_NAME ?? "s3-repository",
//                 }
//             }
//         }
//     }
//     try {
//         const command = new CreateCodeReviewCommand(input);
//         const response = await cgClient.send(command);
//         const codeReviewARN = response.CodeReview?.CodeReviewArn;
//     } catch (error){
//         return false;
//     }
// }
