import { CreateProductAtStorageRequest } from './../types/CreateProductAtStorageRequest';
import { Product } from './../entities/product';
import { IRequest } from './../types/IRequest';
import { IResponse } from './../types/IResponse';
import { ResponseHandler } from '../types/ResponseHandler';
import { IStatusesResponse } from '../types/IStatusesResponse';
import { UpdateProductAtStorageRequest } from '../types/UpdateProductAtStorageRequest';
import { createProductAtStorage, updateProductAtStorage } from '../services/storageService';
import { StockLog, Type } from '../entities/stockLog';

const updateStockAtStorage = async(req: IRequest<UpdateProductAtStorageRequest>, res: IResponse<ResponseHandler<IStatusesResponse>>): Promise<IResponse<ResponseHandler<IStatusesResponse>>> => {
    try {
        const findProduct = await Product.findOneBy({id: req.body.productId})
        
        if(!findProduct) {
            return res.json(new ResponseHandler({message: "No product found by id!"}).returnError())
        }
        
        const previousQuantity = findProduct.quantity

        
        const result = await updateProductAtStorage(req.body)
        if(!result || isNaN(result)) return res.json(new ResponseHandler({message: "Something went wrong!"}).returnError())
        
        const newImportLog = StockLog.create({
            productId: findProduct.id,
            userId: req.userId,
            previousQuantity,
            newQuantity: result,
            type: (findProduct.quantity > req.body.storagePlacement.quantity) ? Type.Export : Type.Import
        })
        
        await newImportLog.save()

        return res.json(new ResponseHandler({}).returnSuccess())
    } catch (error) {
        console.log(error)
        return res.json(new ResponseHandler({}).returnInternal())
    }
}

const crateStockAtStorage = async(req: IRequest<CreateProductAtStorageRequest>, res: IResponse<ResponseHandler<IStatusesResponse>>): Promise<IResponse<ResponseHandler<IStatusesResponse>>> => {
    try {
        const result = await createProductAtStorage(req.body)
        if(!result) return res.json(new ResponseHandler({}).returnError())

        return res.json(new ResponseHandler({}).returnSuccess())
    } catch (error) {
        return res.json(new ResponseHandler({}).returnInternal())
    }
}

export const storageController = {
    updateStockAtStorage,
    crateStockAtStorage
}