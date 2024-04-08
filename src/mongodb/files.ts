import mongoose from "mongoose";

interface File {
    fileName:           string,
    projectId:          string,
    reviewStatus:       "not available" | "pending" | "done",
    recommendations:    Recommendation[],
}

interface FileWithId { id:                 string,
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
    },
    recommendationCategory: {
        type: [String],
    },
    severity: {
        type: String,
    },
    startLine: {
        type: Number,
    },
    endLine: {
        type: Number,
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
        const filter = { _id: fileId };
        const confirmFile = await FileModel.findOne(filter);
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

// export const removeAllFiles = async(projectId: string)
//     : Promise<boolean> => {
//     try {
//         const filter = { projectId };
//         const confirm = FileModel.deleteMany(filter);
//         if(!confirm){
//             return false;
//         }
//         return true;
//     } catch (error) {
//         return false;
//     }
// }
//
// export const removeFile = async(projectId: string, fileName: string)
//     : Promise<boolean> => {
//     try {
//         const filter = { projectId, fileName };
//         const confirm = FileModel.deleteOne(filter);
//         if(!confirm){
//             return false;
//         }
//         return true;
//     } catch (error){
//         return false;
//     }
// }

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

