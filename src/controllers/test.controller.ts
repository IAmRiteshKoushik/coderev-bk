import { Request, Response } from "express";

export function dummyCredentials(req: Request, res: Response){

}

export function dummyProjects(req: Request, res: Response){

}

export function dummyReview(req: Request, res: Response){

}

export function dummyFiletree(req: Request, res: Response){

}

export function dummyAllReviews(req: Request, res: Response){

}

const dummyData = {
    credentials : {
        username : "root",
        password : "root",
    },
    projects : [
        {
            projectId : 1,
            title : "My First Project",
            description : "Just a project description"
        },
        {
            projectId : 2,
            title : "My Second Project",
            description : "Just another project description"
        }
        
    ],
    reviews : [
        {
            projectAssociatedWith : 1
        },
        {
            projectAssociatedWith : 1
        }, 
        {
            projectassociatedwith : 1
        },
        {
            projectassociatedwith : 2
        },
        {
            projectassociatedwith : 2
        },
    ],
    fileTree : {

    }


}


