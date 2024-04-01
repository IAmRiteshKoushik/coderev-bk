import jwt, { Secret } from "jsonwebtoken";

const SECRET_KEY: Secret = process.env.SECRET_KEY ?? "your-secret-key-here";

interface claims {
    email: string,
    firstName: string,
    lastName: string,
}

export function newToken(payload: claims, days: number): string {
    const token = jwt.sign(payload, SECRET_KEY, {
        expiresIn: `${days} days`
    });
    return token; 
}
