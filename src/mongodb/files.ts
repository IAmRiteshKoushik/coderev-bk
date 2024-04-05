import mongoose from "mongoose";

interface File {
    fileName: string,
    projectId: string,
    reviewStatus: "not available" | "pending" | "done",
    recommendations: Recommendation[],
}

interface FileWithId {
    _id: mongoose.Schema.Types.ObjectId,
    fileName: string,
    projectId: string,
    reviewStatus: "not available" | "pending" | "done",
    recommendations: Recommendation[],
}

interface Recommendation {
    description: string,
    recommendationCategory: string[],
    severity: string,
    startLine: number,
    endLine: number,
}

const recommendationSchema = new mongoose.Schema<Recommendation>({
    description: {
        type: String,
        required: true,
    },
    recommendationCategory: {
        type: [String],
        required: true,
    },
    severity: {
        type: String,
        required: true,
    },
    startLine: {
        type: Number,
        required: true
    },
    endLine: {
        type: Number,
        required: true,
    },
});

const fileSchema = new mongoose.Schema<File>({
    fileName: {
        type: String,
        required: true,
    },
    projectId: {
        type: String,
        required: true,
    },
    reviewStatus: {
        type: String,
        required: true,
        enum: ["not available", "pending", "done"]
    },
    recommendations : {
        type: [recommendationSchema],
    },
});

const FileModel = mongoose.model("files", fileSchema);

export const removeAllFiles = async(projectId: string)
    : Promise<boolean> {

}

export const removeFile = async(projectId: string, fileName: string)
    : Promise<boolean> {

}

export const createFile = async(fileData: File)
    : Promise<File | false> => {

}

export const updateReviewStatus = async(projectId: string, fileName: string)
    : Promise<File | false> => {

}

export const addRecommendation = async(projectId: string, fileName: string)
    : Promise<File | false> => {

}

