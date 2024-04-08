import { exec } from "child_process";
import JSZip from "jszip";
import { createWriteStream } from "node:fs";
import { readFile } from "node:fs/promises";
import dotenv from "dotenv";
dotenv.config();

const MULTER_STORE = process.env.TEMP_STORAGE ?? "temp-store-here";
const STORAGE_UNIT = process.env.STORAGE_UNIT ?? "storage-unit-here";

// The following functions should be refactored by using the fs and fs/promises
// library to handle operations in a safer manner. Currently this would run 
// only on a UNIX/Linux file-system.

export const createProjectStorage = async (projectId: string) 
    : Promise<boolean> => {
    try {
        console.log(`mkdir ${STORAGE_UNIT}/${projectId}`);
        exec(`mkdir ${STORAGE_UNIT}/${projectId}`);
        return true;
    } catch (error){
        return false;
    }
}

export const addFilesToStorage = async (projectId: string) 
    : Promise<boolean> => {
    try {
        exec(`mv ${MULTER_STORE}/${projectId}* ${STORAGE_UNIT}/${projectId}/`);
        return true;
    } catch (error){
        return false;
    }
}

// export const removeProjectFromStorage = async(projectId: string)
//     : Promise<boolean> => {
//     try {
//         exec(`rm -rf ${STORAGE_UNIT}/${projectId}`);
//         return true;
//     } catch (error) {
//         return false; 
//     }
// }
//
// export const removeFileFromStorage = async(projectId: string, fileName: string)
//     : Promise<boolean> => {
//     try {
//         exec(`rm ${STORAGE_UNIT}/${projectId}/${projectId + "-" + fileName}`);
//         return true;
//     } catch (error){ 
//         return false;
//     }
// }

export const specialZip = async(projectId: string) => {
    const pathToZip = `${STORAGE_UNIT}/${projectId}/source.zip`
    exec(`zip -r ${pathToZip} ${STORAGE_UNIT}/${projectId}/`);
    return pathToZip;
    // Need better zipping functionality
}
export const deleteZip = async(projectId: string) => {
    exec(`rm ${STORAGE_UNIT}/${projectId}/source.zip`);
    // Need better deleting functionality
}

export const zipAndMove = async(projectId: string, fileNames: string[])
    : Promise<boolean> => {
    try {
        const zip = new JSZip();
        for(const file of fileNames){
            const filePath = `${STORAGE_UNIT}/${projectId}/${file}`;
            const content = await readFile(filePath, 'utf8');
            zip.file(file, content);
        }
        const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
        const writeStream = createWriteStream(`${STORAGE_UNIT}/${projectId}/source.zip`);
        writeStream.write(zipContent);
        writeStream.on('finish', () => {
            console.log("Zip file created successfully")
            return true;
        });
        writeStream.on('error', () => {
            console.log("Zip file creation failed");
            return false;
        });
        writeStream.end();
        return true;
    } catch (error){
        exec(`rm ${STORAGE_UNIT}/${projectId}/source.zip`);
        return false;
    }
}

export const readFileContent = async(projectId: string, fileName: string) 
: Promise<string | false> => {
    try {
        const data: string = await readFile(`${STORAGE_UNIT}/${projectId}/${fileName}`, 'utf-8');
        console.log(data);
        return data;
    } catch (error){
        console.log(error);
        return false;
    }
}
