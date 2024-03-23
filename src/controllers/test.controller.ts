import { Request, Response } from "express";

// These controllers are written synchronoulsy as there are no async 
// operations involved in these like Database reads, writes or file IO
// Other controllers may or may not require async calls in them
export function dummyCredentials(req: Request, res: Response){
    try {
        const username = req.body.username;
        const password = req.body.password;
        
        // Check presence of both fields
        if(!username || !password) {
            return res.status(400).json({
                message : "Bad Request",
            });
        }

        // Check if user exists
        if(username != "root" || password != "root"){
            return res.status(401).json({
                message: "UNAUTH : Invalid username or password",
            })
        }

        // All checks passed
        return res.status(200).json({
            message : "Welcome",
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message : "Bad Request"
        });
    }
}

export function dummyProjects(req: Request, res: Response){
    try {
        // Return back a list of projects
        const responseJSON = { ...dummyData.projects };
        res.status(200).json(responseJSON); 
    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
}

export function dummyReview(req: Request, res: Response){
    try {
        const reviewId = req.params.reviewId;
        for(let i = 0; i < dummyData.reviews.length; i++){
            if(String(dummyData.reviews[i].reviewId) == reviewId){
                return res.status(200).json(dummyData.reviews[i])
            }
        }
        // If review-id does not exist
        return res.status(404).json({
            message : "Review ID does not exist!"
        })
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export function dummyFiletree(req: Request, res: Response){
    try {
        // Return back a filetree-like structure
        return res.status(200).json(dummyData.fileTree);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }

}

export function dummyAllReviews(req: Request, res: Response){
    try {
        
        const projId = req.body.projId;
        let responseArr: Array<any> = [];
        // Return back a list of reviews
        for(let i = 0; i < dummyData.reviews.length; i++){
            if(dummyData.reviews[i].projectAssociatedWith == projId){
                responseArr.push(dummyData.reviews[i])
            }
        }
        res.status(200).json({
            reviews : responseArr
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

const dummyData = {
    credentials: {
        username: "root",
        password: "root",
    },
    projects: [
        {
            projectId: 1,
            title: "My First Project",
            description: "Just a project description"
        },
        {
            projectId: 2,
            title: "My Second Project",
            description: "Just another project description"
        }
    ],
    reviews: [
        {
            reviewId: 11,
            projectAssociatedWith: 1,
            startLine: 2,
            endLine: 9,
            description: "Lorem ipsum dolor sit amet, qui minim labore \
            adipisicing minim sint cillum sint consectetur cupidatat.",
        },
        {
            reviewId: 12,
            projectAssociatedWith: 1,
            startLine: 3,
            endLine: 25,
            description: "Lorem ipsum dolor sit amet, qui minim labore \
            adipisicing minim sint cillum sint consectetur cupidatat.",
        }, 
        {
            reviewId: 13,
            projectAssociatedWith: 1,
            startLine: 4,
            endLine: 4,
            description: "Lorem ipsum dolor sit amet, qui minim labore \
            adipisicing minim sint cillum sint consectetur cupidatat.",
        },
        {
            reviewId: 21,
            projectAssociatedWith: 2,
            startLine: 1,
            endLine: 4,
            description: "Lorem ipsum dolor sit amet, qui minim labore \
            adipisicing minim sint cillum sint consectetur cupidatat.",
        },
        {
            reviewId: 22,
            projectAssociatedWith: 2,
            startLine: 2,
            endLine: 10,
            description: "Lorem ipsum dolor sit amet, qui minim labore \
            adipisicing minim sint cillum sint consectetur cupidatat.",
        }
    ],
    fileTree : {
        directoryName : "src",
        subDirsExist : true, // If directories exist
        filesExist : false, // If files exist
        subDirs : [
            {
                directoryName : "app",
                subDirsExist : false,
                filesExist : true,
                subDirs : [],
                files: [
                    {
                        fileName: "index.py"
                    },
                    {
                        fileName: "main.py"
                    },
                    {
                        fileName: "script.py"
                    }
                ]
            },
        ],
        files : []
    },
}


