import { checkPasswordSystem } from '../services/accountService';
import { SystemAccount } from './../entities/systemAccount';
import { IStatusesResponse } from '../types/IStatusesResponse';
import { Type, User, Role } from '../entities/user';
import { LoginResponse } from '../types/loginResponse';
import { checkUsernameSystemAccount, getTypeUser, loginSystemAccount, registerSystemAccount } from '../services/accountService';
import { UserResponse } from '../types/userResponse';
import { IResponse } from "../types/IResponse"
import { Request } from 'express'
import { ResponseHandler } from '../types/ResponseHandler';
import emailValidator from "email-validator";
import passwordValidator from 'password-validator';
import jwt from "jsonwebtoken";
import argon2 from 'argon2';
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

        const loginSystem = await loginSystemAccount(username.toLowerCase(), password)
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

const updateOrtherUser = async(_req: Request, _res: IResponse<UserResponse>) =>{
    try {
        const name: string = _req.body.name
        const email: string = _req.body.email
        const phone: string = _req.body.phone
        const role: string = _req.body.role
        const password: string | undefined = _req.body.password
        const id: number = +_req.params.id

        //check if id input is invalid (not a number) or null
        if(isNaN(id) || !id) {
            return _res.json(new ResponseHandler({message: "Wrong request format"}).returnError())
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

        if (!role || role == ""){
            return _res.json(new ResponseHandler({message: "variable role not exist or empty!"}).returnError())
        }

        if(!emailValidator.validate(email)){
            return _res.json(new ResponseHandler({message: "Wrong email format!"}).returnError())
        }

        if(!phoneValidator(phone).validate()){
            return _res.json(new ResponseHandler({message: "Wrong phone format!"}).returnError())
        }

        if(!Object.values(Role).includes(role as Role)){
            return _res.json(new ResponseHandler({message: "Wrong role format!"}).returnError())
        }

        await User.update({id: id}, {
            name: name,
            email: email,
            role: role as Role,
            phone: phone
        })
        
        if(password && password != ""){
            if(await getTypeUser(id) == Type.SYSTEM){
                const passwordHash = await argon2.hash(password);
                await SystemAccount.update({userId: id},{
                    password: passwordHash
                })
            }
        }

        return _res.json(new ResponseHandler({message: "Update Infomation Successfully!"}).returnSuccess())
    } catch (error) {
        return _res.json(new ResponseHandler({message: "Internal server error!"}).returnInternal())
    }
}

const changePassword = async(_req: Request, _res: IResponse<UserResponse>) =>{
    try {
        const oldPassword = _req.body.oldpassword
        const password = _req.body.password
        const rePassword = _req.body.repassword
        const access_token = _req.headers.access_token as string;
        const data = await <jwt.UserPayLoad>jwt.verify(access_token, process.env.JWT_SECRET_TOKEN as string)

        if(!await checkPasswordSystem(data.id, oldPassword)){
            return _res.json(new ResponseHandler({message: "Old Password incorrect"}).returnError())
        }

        if(await getTypeUser(data.id) !== Type.SYSTEM){
            return _res.json(new ResponseHandler({message: "Social Account Can't Change Password"}).returnError())
        }

        if (!password || password == ""){
            return _res.json(new ResponseHandler({message: "variable password not exist or empty!"}).returnError())
        }

        if (!rePassword || rePassword == ""){
            return _res.json(new ResponseHandler({message: "variable password not exist or empty!"}).returnError())
        }

        if(!schemaPasword.validate(password)){
            return _res.json(new ResponseHandler({message: "Wrong password format. Password includes uppercase, lowercase letters, numbers and special characters. Least 8 character!"}).returnError())
        }

        if(password !== rePassword){
            return _res.json(new ResponseHandler({message: "Password not incorrect"}).returnError())
        }

        const passwordHash = await argon2.hash(password);

        await SystemAccount.update({userId: data.id},{
            password: passwordHash
        })

        return _res.json(new ResponseHandler({message: "Change Password Successfully!"}).returnSuccess())
    } catch (error) {
        return _res.json(new ResponseHandler({message: "Internal server error!"}).returnInternal())
    }
}

export const accountController = {
    register,
    login,
    info,
    updateOrtherUser,
    changePassword
}