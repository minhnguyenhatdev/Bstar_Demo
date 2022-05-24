import * as jwt from "jsonwebtoken"
declare module "jsonwebtoken"{
    export interface UserPayLoad extends jwt.JwtPayload{
        id: number,
        role: string
    }
}