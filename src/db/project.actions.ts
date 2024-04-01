import mongoose from "mongoose";
import { ChangeFilesModel, Project } from "../models/project.model";

const projectSchema = new mongoose.Schema<Project>({
    _id: mongoose.Schema.Types.ObjectId,
    projectName : {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    fileCount: {
        type: Number,
        required: true,
    },
    tags: {
        // Supported tags : Java, Python, TypeScript, JavaScript
        type: [String],
        required: false,
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
export const getAllProjects = async (email: string): Promise<Project[] | null> => {
    try {
        const data = await ProjectModel.find({ email });
        return data;
    } catch (error){
        return null;
    }
}

export const createProject = async (projectData: Project)
    : Promise<Project | null> => {
    try {
        const newProject = new ProjectModel(projectData);
        await newProject.save();
        return newProject;
    } catch (error){
        return null;
    }
}

export const alterFileCount = async(updateData: ChangeFilesModel)
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

export const deleteProject = async (email: string, projectName: string)
    : Promise<boolean> => {
    try {
        const deleteProject = await ProjectModel.deleteOne({ projectName, email });
        if(!deleteProject){
            return false;
        }
        return true;
        
    } catch (error){
        return false;
    }
}
