import { Router, Request, Response } from "express";
import { handleUpload } from "../helpers/upload.helper";
import { uploadToS3 } from "../services/s3.service";
import { exec } from "child_process";
import fs from "node:fs";
import { backupCreateCodeReview } from "../services/codeGuru.service";

const testRouter = Router();

testRouter.get("/", (req: Request, res: Response) => {
    res.send("Server is up");
});

testRouter.post("/upload", 
    (req, res, next) => {
        // Cleaning the space before adding files in
        exec("rm -rf /home/rk/store");
        console.log("Cleaned");
        exec("mkdir /home/rk/store");
        console.log("Created");
        next();
    }, 
    handleUpload, 
    (req, res) => {
        const fileList = fs.readdirSync("/home/rk/store");
        const data = fs.readFileSync(`/home/rk/store/${fileList[0]}`, "utf-8");
        res.status(200).json({
            message: data,
            filetype: fileList[0].split(".")[1],
        });
        console.log("Code sent back to browser");
});

testRouter.get("/getReview", (req, res) => {
        console.log("You are in");
        exec("zip -r /home/rk/store/source.zip /home/rk/store");
        console.log("Zipping complete");
        uploadToS3("/home/rk/store");
        console.log("uploadToS3 complete");
        // backupCreateCodeReview();
        res.status(200).json({
            message: "Code sent to s3",
        });
    }
);

testRouter.get("/checkReview", (req, res) => {
    console.log("You are testing");
    res.status(200).json({
        message: "Checking codeguru for completion",
    })
});

export default testRouter;
