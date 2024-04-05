import mongoose from "mongoose";

type validTags = "" | "JavaScript" | "Python" | "Java"

interface Project {
    projectName: string,
    email: string,
    tags: validTags[],
    codeReviewARN: string,
}

interface ProjectWithId{
    id: string,
    projectName: string,
    email: string,
    tags: validTags[],
    codeReviewARN: string,
}


const projectSchema = new mongoose.Schema<Project>({
    projectName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        requried: true,
    },
    tags: {
        type: [String],
        required: true,
        default: [""],
    },
    codeReviewARN: {
        type: String,
    },
});

export const ProjectModel = mongoose.model("projects", projectSchema);

export const removeAllProjects = async(email: string)
    : Promise<boolean> => {

}

export const removeProject = async(email: string, projectId: string)
    : Promise<boolean> => {

}

export const createProject = async(projectData: Project)
    : Promise<ProjectWithId | false> => {

}

export const updateTags = async(tags: validTags)
    : Promise<ProjectWithId | false> => {

}

export const updateCodeReviewARN = async(projectData: Project)
    : Promise<ProjectWithId | false> => {

}
