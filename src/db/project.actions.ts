import mongoose from "mongoose";
import { ChangeFilesModel, Project, ProjectWithId } from "../models/project.model";

const projectSchema = new mongoose.Schema<Project>({
    projectName : {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    fileCount: {
        type: Number,
        required: true,
    },
    tags: {
        // Supported tags : Java, Python, TypeScript, JavaScript
        type: [String],
        enum: ["Java", "Python", "TypeScript", "JavaScript"]
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

export const ProjectModel = mongoose.model("projects", projectSchema);

// Actions
export const getAllProjects = async (email: string): Promise<Project[] | null | false> => {
    try {
        const data = await ProjectModel.find({ email });
        return data; // can return Project[] or null if no data exists
    } catch (error){
        return false; // Upon error return false
    }
}

export const createProject = async (projectData: Project)
    : Promise<ProjectWithId | null> => {
    try {
        const newProject = new ProjectModel(projectData);
        const confirmSave: any = await newProject.save(); // Need better type
        return confirmSave;
    } catch (error){
        return null;
    }
}

export const alterFileCountAndTag = async(updateData: ChangeFilesModel)
    : Promise<boolean> => {
    try {
        const updateProject = await ProjectModel.findOneAndUpdate({ 
            updateData 
        });

        if (!updateProject) {
            return false;
        }
        return true;
    } catch (error){
        return false;
    }
}

export const deleteAllProjects = async(email: string): Promise<boolean> => {
    try {
        const deleteConfirm = await ProjectModel.deleteMany({
            email: email
        });
        if(!deleteConfirm){
            return false;
        }
        return true;
    } catch (error){
        return false;
    }
}

export const deleteProject = async(projectName: string): Promise<boolean> => {
    try {
        const deleteConfirm = await ProjectModel.findOneAndDelete({
            projectName,
        });
        if(!deleteConfirm){
            return false;
        }
        return true;
    } catch (error){
        return false;
    }
}

