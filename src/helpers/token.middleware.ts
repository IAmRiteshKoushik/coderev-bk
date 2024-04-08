import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const SECRET_KEY: Secret = process.env.SECRET ?? "your-secret-key-here";

interface TokenizedRequest extends Request {
    token: string | JwtPayload; 
}

export const authenticate = async (req: Request, res: Response, 
    next: NextFunction) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if(!token){
            res.status(401).json({
                message: "Invalid Token"
            });
            return;
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        (req as TokenizedRequest).token = decoded; 
        next();
    } catch (error){
        res.status(401).json({
            message: "Could not validate token",
        });
        return;
    }
}
