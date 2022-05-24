import { IStatusesResponse } from '../types/IStatusesResponse';
import { Type, User } from '../entities/user';
import { LoginResponse } from '../types/loginResponse';
import { checkUsernameSystemAccount, loginSystemAccount, registerSystemAccount } from '../services/accountService';
import { IResponse } from "../types/IResponse"
import { Request } from 'express'
import { ResponseHandler } from '../types/ResponseHandler';
import emailValidator from "email-validator";
import passwordValidator from 'password-validator';
import jwt from "jsonwebtoken";
const phoneValidator = require("vn-phone-validator");
const usernameRegex = /^[a-zA-Z0-9]+$/;
var schemaPasword = new passwordValidator()
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces 
.has().symbols()

const register = async(_req : Request, _res: IResponse<ResponseHandler<IStatusesResponse>>) => {
    try {
        const username: string = _req.body.username
        const password: string = _req.body.password
        const name: string = _req.body.name
        const email: string = _req.body.email
        const phone: string = _req.body.phone

        if (!username || username == ""){
            return _res.json(new ResponseHandler({message: "variable username not exist or empty!"}).returnError())
        }

        if (!password || password == ""){
            return _res.json(new ResponseHandler({message: "variable password not exist or empty!"}).returnError())
        }

        if (!name || name == ""){
            return _res.json(new ResponseHandler({message: "variable name not exist or empty!"}).returnError())
        }

        if (!email || email == ""){
            return _res.json(new ResponseHandler({message: "variable email not exist or empty!"}).returnError())
        }

        if (!phone || phone == ""){
            return _res.json(new ResponseHandler({message: "variable phone not exist or empty!"}).returnError())
        }

        if (!usernameRegex.test(username)){
            return _res.json(new ResponseHandler({message: "username not vaild!"}).returnError())
        }

        if(await checkUsernameSystemAccount(username)){
            return _res.json(new ResponseHandler({message: "username already exists!"}).returnError())
        }

        if(!emailValidator.validate(email)){
            return _res.json(new ResponseHandler({message: "Wrong email format!"}).returnError())
        }

        if(!phoneValidator(phone).validate()){
            return _res.json(new ResponseHandler({message: "Wrong phone format!"}).returnError())
        }

        if(!schemaPasword.validate(password)){
            return _res.json(new ResponseHandler({message: "Wrong password format. Password includes uppercase, lowercase letters, numbers and special characters. Least 8 character!"}).returnError())
        }

        const checkSocial = await User.findOne({
            where:{
                email: _req.body.email,
                type: Type.SOCIAL
            }
        })
    
        if(checkSocial){
            return _res.json(new ResponseHandler({message: "Email exist in Social Account!"}).returnError())
        }

        const createAccount = await registerSystemAccount(_req.body);

        if(!createAccount){
            return _res.json(new ResponseHandler({message: "Error create Account!"}).returnError())
        }

        return _res.json(new ResponseHandler({message: "Created Account Successfully!"}).returnSuccess())

    } catch (error) {
        return _res.json(new ResponseHandler({message: "Internal server error!"}).returnInternal())
    }
}

const login = async(_req: Request, _res: IResponse<LoginResponse>) =>{
    try {
        const username: string = _req.body.username
        const password: string = _req.body.password

        if (!usernameRegex.test(username)){
            return _res.json(new ResponseHandler({message: "Username not vaild!"}).returnError())
        }

        const loginSystem = await loginSystemAccount(username, password)
        if (!loginSystem){
            return _res.json(new ResponseHandler({message: "Incorrect username or password!"}).returnError())
        }

        const accessToken = jwt.sign({
            id: loginSystem.user.id,
            role: loginSystem.user.role
        } , process.env.JWT_SECRET_TOKEN as string, {algorithm: "HS256", expiresIn: "24h"})

        return _res.json(new ResponseHandler({message: "Login Successfully!", data: {access_token: accessToken}}).returnSuccess())

    } catch (error) {
        return _res.json(new ResponseHandler({message: "Internal server error!"}).returnInternal())
    }
}

const info = async(_req: Request, _res: IResponse<IStatusesResponse>) =>{
    try {
        const access_token = _req.headers.access_token as string;
        const data = await <jwt.UserPayLoad>jwt.verify(access_token, process.env.JWT_SECRET_TOKEN as string)
        const user = await User.findOneBy({id: data.id})
        return _res.json(new ResponseHandler({message: "Get Infomation Successfully!", data: {user: user || undefined}}).returnSuccess())
    } catch (error) {
        return _res.json(new ResponseHandler({message: "Internal server error!"}).returnInternal())
    }
}

export const accountController = {
    register,
    login,
    info,
}