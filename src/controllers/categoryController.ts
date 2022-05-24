import { ResponseHandler } from '../types/ResponseHandler';
import { IResponse } from "../types/IResponse"
import { IRequest } from "../types/IRequest"
import { Category } from "../entities/category"
import { Request } from 'express';

//add a new category
// author: public
const getAllCategory = async(_req : Request, res: IResponse<ResponseHandler<Category[]>>): Promise<IResponse<ResponseHandler<Category[]>>> => {
    try {
        const categories = await Category.find()
        if(!categories) {
            return res.json(new ResponseHandler({message: "No category found!"}).returnError())
        }

        return res.json(new ResponseHandler({message: "Get category list successfully", data: categories}).returnSuccess())
    } catch (error) {
        console.log(error)
        return res.json(new ResponseHandler({}).returnInternal())
    }
}

// add a new category
// author: manager
// request: Category type
const addCategory = async(req : IRequest<Category>, res: IResponse<ResponseHandler<Category>>): Promise<IResponse<ResponseHandler<Category>>> => {
    try {
        const category = req.body
 
        const newCategory = Category.create(category)

        //failed to create new category entity
        if(!newCategory) {
            return res.json(new ResponseHandler({message: "Create category failed!"}).returnError())
        }

        //all ok
        await newCategory.save()

        return res.json(new ResponseHandler({message: "Created category successfully!", data: newCategory}).returnSuccess())

    } catch (error) {
        console.log(error)
        return res.json(new ResponseHandler({}).returnInternal())
    }
}

// update a category
// author: manager
// request: Category type
const updateCategory = async(_req : IRequest<Category>, res: IResponse<ResponseHandler<Boolean>>): Promise<IResponse<ResponseHandler<Boolean>>> => {
    try {
        return res.json(new ResponseHandler({}).returnSuccess())
    } catch (error) {
        console.log(error)
        return res.json(new ResponseHandler({}).returnInternal())
    }
}

export const categoryController = {
    getAllCategory,
    addCategory,
    updateCategory
}
