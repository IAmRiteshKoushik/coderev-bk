export interface Project {
    projectName:    string,
    email:          string,
    fileCount:      number,
    tags:           string[],
    createdAt:      Date,
    updatedAt:      Date
}

export type ChangeFilesModel = {
    projectName:    string,
    email:          string,
    fileCount:      number,
    updatedAt:      Date
}

