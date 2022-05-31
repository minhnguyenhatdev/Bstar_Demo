import { checkPasswordSystem, queryUserService } from '../services/accountService';
import { SystemAccount } from './../entities/systemAccount';
import { IStatusesResponse } from '../types/IStatusesResponse';
import { Type, User, Role, Status } from '../entities/user';
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
import { UsersQueryResponse } from '../types/UsersQueryResponse';
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

const addUser = async(_req : Request, _res: IResponse<ResponseHandler<IStatusesResponse>>) => {
    try {
        const username: string = _req.body.username
        const password: string = _req.body.password
        const name: string = _req.body.name
        const email: string = _req.body.email
        const phone: string = _req.body.phone
        const role = _req.body.role
        const status = _req.body.status

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

        if(!Object.values(Role).includes(role)){
            return _res.json(new ResponseHandler({message: "Wrong role name"}).returnError())
        }

        if(!Object.values(Status).includes(status)){
            return _res.json(new ResponseHandler({message: "Wrong status name"}).returnError())
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

        if(!schemaPasword.validate(password)){
            return _res.json(new ResponseHandler({message: "Wrong password format. Password includes uppercase, lowercase letters, numbers and special characters. Least 8 character!"}).returnError())
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

const queryUser = async(req : Request, res: IResponse<ResponseHandler<UsersQueryResponse>>): Promise<IResponse<ResponseHandler<UsersQueryResponse>>> => {
    try {
        //initializing queries value
        let sortBy: string | undefined = undefined
        let sortOrder = "descending"

        //change sortBy, sortOrder to given value if they are in request queries
        if(req.query.sortBy) sortBy = req.query.sortBy as string
        if(req.query.sortOrder) sortOrder = req.query.sortOrder as string
        
        //convert queries in request from string to number
        const pageIndex: number = req.query.pageIndex ? +req.query.pageIndex : 1
        const pageLimit: number = req.query.pageLimit ? +req.query.pageLimit : 10

        //get pageTotal from req.query passed from middleware
        const pageTotal: number = req.query.pageTotal ? +req.query.pageTotal : 1
        const searchInput: string = req.query.searchInput ? req.query.searchInput as string : ''

        //check if current pageIndex lower than pageTotal
        if(pageIndex > pageTotal) {
            return res.json(new ResponseHandler({message: "Invalid query!"}).returnError())
        }
        
        // query product
        const users = (sortBy ? await queryUserService(pageIndex, pageLimit, sortBy, sortOrder, searchInput) : await queryUserService(pageIndex, pageLimit))
        if(!users) {
            return res.json(new ResponseHandler({message: "Invalid query!"}).returnError())
        }
        //define result from queried product list to ProductsQueryResponse object type
        const result = new UsersQueryResponse(users, pageIndex, pageLimit, pageTotal)

        return res.json(new ResponseHandler({message: "Queried successfully!", data: result}).returnSuccess())
    } catch (error) {
        return res.json(new ResponseHandler({}).returnInternal())
    }
}

const changeStatus = async(_req: Request, _res: IResponse<IStatusesResponse>) =>{
    try {
        let id = +_req.params.id
        let status = _req.body.status

        if(!Number.isInteger(id)){
            return _res.json(new ResponseHandler({message: "Wrong format User ID!"}).returnError())
        }

        if(!Object.values(Status).includes(status)){
            return _res.json(new ResponseHandler({message: "Wrong format Status!"}).returnError())
        }

        await User.update({id: id}, {
            status: status
        })
        return _res.json(new ResponseHandler({message: "Change Status Success!"}).returnSuccess())
    } catch (error) {
        return _res.json(new ResponseHandler({message: "Internal server error!"}).returnInternal())
    }
}

export const accountController = {
    register,
    addUser,
    login,
    info,
    updateOrtherUser,
    changePassword,
    queryUser,
    changeStatus
}