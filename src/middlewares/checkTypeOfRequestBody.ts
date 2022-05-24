import { UpdateProductAtStorageRequest } from './../types/UpdateProductAtStorageRequest';
import { ProductQueryRequest } from './../types/ProductQueryRequest';
import { IResponse } from './../types/IResponse';
import { Product } from '../entities/product';
import { IRequest } from '../types/IRequest';
import { ResponseHandler } from '../types/ResponseHandler';
import { NextFunction, Response } from "express";
import { validate } from 'class-validator';
import { Category } from '../entities/category';
import { IStatusesResponse } from '../types/IStatusesResponse';
import { StoragePlacement } from '../entities/storagePlacement';
import { CreateProductAtStorageRequest } from '../types/CreateProductAtStorageRequest';

export const validateProductFormat = async(req: IRequest<Product>, res: Response, next: NextFunction) => {
    try {
      const post = Product.create(req.body) 

      const errors = await validate(post)

      //there are errors when validate input request.body
      if(errors.length > 0) {
        return res.json(new ResponseHandler({message: "Wrong product input format"}).returnError())
      }
      else {
        return next() // all ok
      }
    } catch (error) {
        return res.json(new ResponseHandler({}).returnInternal())
    }
}

export const validateCategoryFormat = async(req: IRequest<Category>, res: Response, next: NextFunction) => {
  try {
    const category = Category.create(req.body) 

    const errors = await validate(category)

    //there are errors when validate input request.body
    if(errors.length > 0) {
      return res.json(new ResponseHandler({message: "Wrong category input format"}).returnError())
    }
    else {
      return next() // all ok
    }
  } catch (error) {
      return res.json(new ResponseHandler({}).returnInternal())
  }
}

export const validateUpdateProductPlacementFormat =  async(req: IRequest<UpdateProductAtStorageRequest>, res: Response, next: NextFunction) => {
  try {
    const errors = await validate(req.body)

    //there are errors when validate input request.body
    if(errors.length > 0) {
      return res.json(new ResponseHandler({message: "Wrong input format"}).returnError())
    }
    else {
      return next() // all ok
    }
  } catch (error) {
    return res.json(new ResponseHandler({}).returnInternal())
  }
}


export const validateCreateProductPlacementFormat =  async(req: IRequest<CreateProductAtStorageRequest>, res: Response, next: NextFunction) => {
  try {
    const errors = await validate(req.body)

    //there are errors when validate input request.body
    if(errors.length > 0) {
      return res.json(new ResponseHandler({message: "Wrong input format"}).returnError())
    }
    else {
      return next() // all ok
    }
  } catch (error) {
    return res.json(new ResponseHandler({}).returnInternal())
  }
}

//front-end can only sort product list from one of these type
const queryTypePossible = ["Price", "Name", "Released", "Category"]

export const validateInputForProductQuery = async(req: IRequest<ProductQueryRequest>, res: IResponse<ResponseHandler<IStatusesResponse>>, next: NextFunction) => {
  try {
    //initializing queries value
    let pageLimit = 10
    let pageIndex = 1
    
    //convert queries in request from string to number
    if(req.query.pageIndex) pageIndex = +req.query.pageIndex
    if(req.query.pageLimit) pageLimit = +req.query.pageLimit

    //check if pageIndex and pageLimit after convert is number
    if(isNaN(pageIndex) || isNaN(pageLimit)) {
        return res.json(new ResponseHandler({message: "Invalid query!"}).returnError())
    }

    //init sortBy value if there is in request query
    let sortBy: string | undefined = undefined
    if(req.query.sortBy) sortBy = req.query.sortBy as string

    //check if sortBy in request is query-able
    if(sortBy && !queryTypePossible.includes(sortBy)) {
      return res.json(new ResponseHandler({message: "Invalid query!"}).returnError())
    }

    //count number of product in db
    const lenght = await Product.count()
    let pageTotal =  lenght/pageLimit

    //reformat pageTotal:
    // if pageTotal is not an integer -> round pageTotal up (ex: 9.2 -> 10)
    // else keep same result (ex: 9 -> 9)
    pageTotal = (pageTotal % 1 === 0) ? pageTotal : (Math.ceil(pageTotal))

    //check if current pageIndex lower than pageTotal
    if(pageIndex > pageTotal) {
        return res.json(new ResponseHandler({message: "Invalid query!"}).returnError())
    }
    else {
      //set initialized value to req.query
      req.query.pageTotal = pageTotal.toString()
      req.query.pageIndex =  pageIndex.toString()
      req.query.pageLimit =  pageLimit.toString()
      return next() // all ok
    }
  } catch (error) {
      return res.json(new ResponseHandler({}).returnInternal())
  }
}