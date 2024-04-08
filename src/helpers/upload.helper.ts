import { Request, Response } from "express";
import multer from "multer";
import { createFile } from "../mongodb/files";

const store = process.env.TEMP_STORAGE ?? "/home/rk/temp/";

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
        console.log(file);
        cb(null, store);
    }, 
    filename: (req, file, cb) => {
        const fileName = file.originalname;
        const func = async() => {
            await createFile({
                fileName: fileName,
                projectId: fileName.split("-")[0],
                reviewStatus: "not available",
                recommendations: [],
            });
        }
        func();
        cb(null, fileName);
    },
});

export const handleUpload = multer({ storage }).array("files");
