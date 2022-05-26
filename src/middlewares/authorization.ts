import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../types/ResponseHandler";
import jwt from "jsonwebtoken";
import { IRequest } from "../types/IRequest";

export const verifyAll = async(_req: Request, _res: Response, next: NextFunction) => {
    try {
        const accessToken = _req.headers.access_token as string
        if (!accessToken){
            return _res.json(new ResponseHandler({message: "AccessToken does not exist"}).returnUnauthorized())
        }
        try{
            await jwt.verify(accessToken, process.env.JWT_SECRET_TOKEN as string);

            return next()
        }catch(error){
            return _res.json(new ResponseHandler({message: "Incorect token or token expried!"}).returnUnauthorized())
        }
    } catch (error) {
        return _res.json(new ResponseHandler({message: "Internal server error!"}).returnInternal())
    }
}

export const verifyAdmin = async(_req: Request, _res: Response, next: NextFunction) => {
    try {
        const accessToken = _req.headers.access_token as string
        if (!accessToken){
            return _res.json(new ResponseHandler({message: "AccessToken does not exist"}).returnUnauthorized())
        }
        try{
            const data = await <jwt.UserPayLoad>jwt.verify(accessToken, process.env.JWT_SECRET_TOKEN as string);
            if (data.role != "ADMIN"){
                return _res.json(new ResponseHandler({message: "Your token access denied!"}).returnUnauthorized())
            }
            return next()
        }catch(error){
            return _res.json(new ResponseHandler({message: "Incorect token or token expried!"}).returnUnauthorized())
        }
    } catch (error) {
        return _res.json(new ResponseHandler({message: "Internal server error!"}).returnInternal())
    }
}

export const verifyUser = async(req: IRequest<any>, _res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.access_token as string
        if (!accessToken){
            return _res.json(new ResponseHandler({message: "AccessToken does not exist"}).returnUnauthorized())
        }
        try{
            const data = await <jwt.UserPayLoad>jwt.verify(accessToken, process.env.JWT_SECRET_TOKEN as string);
            if (data.role != "USER"){
                return _res.json(new ResponseHandler({message: "Your token access denied!"}).returnUnauthorized())
            }
            return next()
        }catch(error){
            return _res.json(new ResponseHandler({message: "Incorect token or token expried!"}).returnUnauthorized())
        }
    } catch (error) {
        return _res.json(new ResponseHandler({message: "Internal server error!"}).returnInternal())
    }
}

export const verifyManager = async(req: Request, _res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.access_token as string
        if (!accessToken){
            return _res.json(new ResponseHandler({message: "AccessToken does not exist"}).returnError())
        }
        try{
            const data = await <jwt.UserPayLoad>jwt.verify(accessToken, process.env.JWT_SECRET_TOKEN as string);
            if (data.role != "MANAGER"){
                return _res.json(new ResponseHandler({message: "Your token access denied!"}).returnError())
            }

            return next()
        }catch(error){
            return _res.json(new ResponseHandler({message: "Incorect token or token expried!"}).returnError())
        }
    } catch (error) {
        return _res.json(new ResponseHandler({message: "Internal server error!"}).returnInternal())
    }
}