import { Request, Response } from "express";
import multer from "multer";

const store = process.env.TEMP_STORAGE ?? "/home/rk/temp/";

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
        console.log(file);
        cb(null, store);
    }, 
    filename: (req, file, cb) => {
        const fileName = file.originalname;
        cb(null, fileName);
    },
});

export const handleUpload = multer({ storage }).array("files");
