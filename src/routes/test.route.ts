import express, { Request, Response } from "express";
import {
    dummyCredentials,
    dummyProjects,
    dummyReview,
    dummyFiletree,
    dummyAllReviews
} from "../controllers/test.controller";

const testRouter = express.Router();

testRouter.post("/login", dummyCredentials);

testRouter.get("/filetree", dummyFiletree);
testRouter.get('/project', dummyProjects);
testRouter.get("/review", dummyAllReviews);
testRouter.get("/review/:reviewId", dummyReview);

export default testRouter;
