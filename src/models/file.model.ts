import { Review } from "./review.model"

export interface File {
    fileName:       string,
    projectName:    string,
    email:          string,
    filePath:       string,
    fileType:       "Python" | "Java" | "JavaScript" | "TypeScript",
    fileSize:       number,
    reviewExist:    boolean,
    reviews:        Review[], // Handles the reviews generated per file
    createdAt:      Date,
    updatedAt:      Date,
}

export type AddReviewFileModel = {
    fileName:       string,
    projectName:    string,
    email:          string,
    reviewExist:    boolean,
    reviews:        Review[],
    updatedAt:      Date,
}

export type ReplaceFileModel = {
    fileName:       string,
    projectName:    string,
    email:          string,
    fileSize:       number,
    fileType:       "Python" | "Java" | "JavaScript" | "TypeScript",
    updatedAt:      Date,
}

export type DeleteFileModel = {
    fileName:       string,
    projectName:    string,
    email:          string,
}
