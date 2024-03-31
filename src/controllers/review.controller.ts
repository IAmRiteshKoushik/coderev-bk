import { Request, Response } from "express";

export const getAllReviews = async(req: Request, res: Response) => {

}

export const getReview = async(req: Request, res: Response) => {
    try {

    } catch (error){
        res.status(500).json({
            message: "ServerError: Could not process request. Please try again!"
        })
    }
}

export const createProjectReview = async(req: Request, res: Response) => {
    try {

    } catch (error) {
        res.status(500).json({
            message: "ServerError: Could not process request. Please try again!"
        });
    }

}

export const createFileReview = async(req: Request, res: Response) => {
    try {

    } catch (error) {
        res.status(500).json({
            message: "ServerError: Could not process request. Please try again!"
        });
    }
}

export const createSnippetReview = async(req: Request, res: Response) => {
    try {

    } catch (error) {
        res.status(500).json({
            message: "ServerError: Could not process request. Please try again."
        });
    }
}
