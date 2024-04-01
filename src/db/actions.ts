import { UserModel } from "./user.actions";
import { ProjectModel } from "./project.actions";
import { FileModel } from "./file.actions";
import { SnippetModel } from "./snippet.actions";

export const deleteUser = async (email: string) : Promise<boolean> => {
    try {
        // Delete user, projects, files and related snippets from DB
        return true;
    } catch (error) {
    return false;
    }
}

export const deleteProject = async (email: string, projectName: string): Promise<boolean> => {
    try {
        // Delete project, related and related snippets from DB
        return true;
    } catch (error){
        return false;
    }
}

export const deleteFile = async (fileId: string): Promise<boolean> => {
    try {
        // Delete file and related snippets from DB
        return true;
    }  catch (error){
        return false;
    }
}

