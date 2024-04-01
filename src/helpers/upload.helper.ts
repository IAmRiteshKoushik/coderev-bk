import { Request, Response } from "express";
import multer from "multer";

const destination = process.env.STORAGE ?? "store/";

const storage = multer.diskStorage({
    
});
const upload = multer({ storage });

