import mongoose from "mongoose";

interface File {
    fileName:           string,
    projectId:          string,
    reviewStatus:       "not available" | "pending" | "done",
    recommendations:    string,
}

interface FileWithId { 
    id:                 string,
    fileName:           string,
    projectId:          string,
    reviewStatus:       "not available" | "pending" | "done",
    recommendations:    string,
}

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
        type: String,
    },
});

const FileModel = mongoose.model("files", fileSchema);

export const getAllFiles = async(projectId: string)
    : Promise<FileWithId[] | false> => {
    try {
        const confirmFiles = await FileModel.find({ projectId });
        const data: FileWithId[] = [];
        for(let i: number = 0; i < confirmFiles.length; i++){
            const record: FileWithId = {
                id:                 confirmFiles[i]._id.toString(),
                fileName:           confirmFiles[i].fileName,
                projectId:          confirmFiles[i].projectId,
                reviewStatus:       confirmFiles[i].reviewStatus,
                recommendations:    confirmFiles[i].recommendations,
            }
            data.push(record);
        }
        return data;
    } catch (error){
        return false;
    }
}

export const getFile = async(fileId: string)
    : Promise<FileWithId | false> => {
    try {
        console.log(fileId);
        const confirmFile = await FileModel.findById(fileId);
        if(!confirmFile){
            return false;
        }
        const data: FileWithId = {
            id:                 confirmFile._id.toString(),
            fileName:           confirmFile.fileName,
            projectId:          confirmFile.projectId,
            reviewStatus:       confirmFile.reviewStatus,
            recommendations:    confirmFile.recommendations,
        }
        return data; 
    } catch (error) {
        return false; // File does not exist or some other error 
    }
}


export const createFile = async(fileData: File)
    : Promise<FileWithId | false> => {
    try {
        const confirm = await FileModel.create(fileData);

        if(!confirm){
            console.log(confirm);
            return false;
        }

        const data: FileWithId = {
            id:                 confirm._id.toString(),
            fileName:           confirm.fileName,
            projectId:          confirm.projectId,
            reviewStatus:       confirm.reviewStatus,
            recommendations:    confirm.recommendations,
        }
        console.log(data);
        return data;
    } catch (error){
        return false;
    }
}

export const updateReviewStatus = async(projectId: string, status: string)
    : Promise<boolean> => {
    try {
        const filter = { projectId };
        const update = { $set: { reviewStatus: status}};
        const options = { new: true };
        const confirm = await FileModel.updateMany(filter, update, options);
        if(!confirm){
            return false;
        }
        return true;
    } catch (error){
        return false;
    }
}

export const addRecommendation = async(projectId: string, fileName: string, recommendation: string) : Promise<FileWithId | false> => {
    try {
        const filter = { projectId, fileName };
        const update = { $set: { recommendations: recommendation, reviewStatus : "done" }};
        const options = { new: true };
        const confirm = await FileModel.findOneAndUpdate(filter, update, options);
        console.log(confirm);
        if(!confirm){
            return false;
        }

        const data: FileWithId = {
            id:                 confirm._id.toString(),
            fileName:           confirm.fileName,
            projectId:          confirm.projectId,
            reviewStatus:       confirm.reviewStatus,
            recommendations:    confirm.recommendations,
        }
        return data;
    } catch (error){
        return false;
    }
}

export const getFileWithNoReview = async(projectId: string)
: Promise<string[] | false> => {
    try {
        const filter = { projectId, reviewStatus: "not available"}
        const confirm = await FileModel.find(filter);
        const data: string[] = [];
        for(let i: number = 0; i < confirm.length; i++){
            data.push(confirm[i].fileName);
        }
        return data;
    } catch (error){
        console.log(error);
        return false;
    }
}

