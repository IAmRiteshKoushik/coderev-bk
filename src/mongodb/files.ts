import mongoose from "mongoose";

interface File {
    fileName:           string,
    projectId:          string,
    reviewStatus:       "not available" | "pending" | "done",
    recommendations:    Recommendation[],
}

interface FileWithId {
    id:                 string,
    fileName:           string,
    projectId:          string,
    reviewStatus:       "not available" | "pending" | "done",
    recommendations:    Recommendation[],
}

interface Recommendation {
    description:            string,
    recommendationCategory: string[],
    severity:               string,
    startLine:              number,
    endLine:                number,
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
    : Promise<boolean> => {
    try {
        const filter = { projectId };
        const confirm = FileModel.deleteMany(filter);
        if(!confirm){
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
}

export const removeFile = async(projectId: string, fileName: string)
    : Promise<boolean> => {
    try {
        const filter = { projectId, fileName };
        const confirm = FileModel.deleteOne(filter);
        if(!confirm){
            return false;
        }
        return true;
    } catch (error){
        return false;
    }
}

export const createFile = async(fileData: File)
    : Promise<FileWithId | false> => {
    try {
        const confirm = await FileModel.create(fileData);

        if(!confirm){
            return false;
        }

        const data: FileWithId = {
            id: confirm._id.toString(),
            fileName: confirm.fileName,
            projectId: confirm.projectId,
            reviewStatus: confirm.reviewStatus,
            recommendations: confirm.recommendations,
        }
        return data;
    } catch (error){
        return false;
    }
}

export const updateReviewStatus = async(projectId: string, fileName: string, status: string)
    : Promise<FileWithId | false> => {
    try {
        const filter = { projectId, fileName};
        const update = { $set: { reviewStatus: status}};
        const options = { new: true };
        const confirm = await FileModel.findOneAndUpdate(filter, update, options);

        if(!confirm){
            return false;
        }

        const data: FileWithId = {
            id: confirm._id.toString(),
            fileName: confirm.fileName,
            projectId: confirm.projectId,
            reviewStatus: confirm.reviewStatus,
            recommendations: confirm.recommendations,
        }
        return data;
    } catch (error){
        return false;
    }
}

export const addRecommendation = async(projectId: string, fileName: string, recommendation: Recommendation) : Promise<FileWithId | false> => {
    try {
        const filter = { projectId, fileName};
        const update = { $set: { recommendation, reviewStatus : "done" }};
        const options = { new: true };
        const confirm = await FileModel.findOneAndUpdate(filter, update, options);

        if(!confirm){
            return false;
        }

        const data: FileWithId = {
            id: confirm._id.toString(),
            fileName: confirm.fileName,
            projectId: confirm.projectId,
            reviewStatus: confirm.reviewStatus,
            recommendations: confirm.recommendations,
        }
        return data;
    } catch (error){
        return false;
    }
}

