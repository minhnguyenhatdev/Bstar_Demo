import { User, Type } from '../entities/user';
import { IResponse } from "../types/IResponse"
import { Request } from 'express'
import { loginSocialAccount } from '../services/accountService';
import { ResponseHandler } from '../types/ResponseHandler';
import { getUrlRedirect, codparser, httpcaller } from '../commons/googleScope';
import jwt from "jsonwebtoken";



const getToken = async(_req: Request, _res: IResponse<ResponseHandler<Object>>) =>{
    try {
        return _res.json(new ResponseHandler({message: "Get Link Token Successfully!", data: {redirect_url: getUrlRedirect()}}).returnSuccess())
    } catch (error) {
        return _res.json(new ResponseHandler({message: "Internal server error!"}).returnInternal())
    }
}

const redirect = async(_req: Request, _res: IResponse<ResponseHandler<Object>>) =>{
    try {
        const token = await codparser(_req.url)
        return _res.json(new ResponseHandler({message: "Get Token Google Successfully!", data: {access_token: token}}).returnSuccess())
    } catch (error) {
        return _res.json(new ResponseHandler({message: "Internal server error!"}).returnInternal())
    }
}

const login = async(_req: Request, _res: IResponse<ResponseHandler<Object>>) =>{
    try {
        const token = _req.body.token
        if (!token || token == ""){
            return _res.json(new ResponseHandler({message: "Token empty or not exist!"}).returnError())
        }

        const data: any = await httpcaller(token)

        const checkSystem = await User.findOne({
            where:{
                email: data.email,
                type: Type.SYSTEM
            }
        })

        if (checkSystem){
            return _res.json(new ResponseHandler({message: "Email exist in System Account!"}).returnError())
        }

        const socialAccount =  await loginSocialAccount(data);

        if(!socialAccount){
            return _res.json(new ResponseHandler({message: "Error Login Social Account!"}).returnError())
        }

        const accessToken = jwt.sign({
            id: socialAccount.user.id,
            role: socialAccount.user.role
        } , process.env.JWT_SECRET_TOKEN as string, {algorithm: "HS256", expiresIn: "24h"})

        return _res.json(new ResponseHandler({message: "Login Google Successfully!", data: {access_token: accessToken}}).returnSuccess())
    } catch (error) {
        return _res.json(new ResponseHandler({message: "Internal server error!"}).returnInternal())
    }
}

export const googleController = {
    getToken,
    redirect,
    login
}