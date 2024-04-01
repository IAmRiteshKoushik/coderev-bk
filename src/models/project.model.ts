import mongoose from "mongoose"

export interface Project {
    _id:            mongoose.Schema.Types.ObjectId,
    projectName:    string,
    email:          string,
    fileCount:      number,
    tags:           string[],
    createdAt:      Date,
    updatedAt:      Date
}

export type ChangeFilesModel = {
    _id:        mongoose.Schema.Types.ObjectId,
    fileCount:  number,
    updatedAt:  Date
}

