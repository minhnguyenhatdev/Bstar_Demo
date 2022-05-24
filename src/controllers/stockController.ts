import { IStatusesResponse } from './../types/IStatusesResponse';
import { ResponseHandler } from './../types/ResponseHandler';
import { IRequest } from '../types/IRequest';
import { IResponse } from "../types/IResponse";
import { User } from '../entities/user';
import { Product } from '../entities/product';
import { ChangeStockRequest } from '../types/ChangeStockRequest';
import { logUpdateStock } from '../services/stockService';

const updateStock = async(req : IRequest<ChangeStockRequest>, res: IResponse<ResponseHandler<IStatusesResponse>>): Promise<IResponse<ResponseHandler<IStatusesResponse>>> => {
    try {
        //init input
        const user = await User.findOneBy({id: req.body.userId})
        const product = await Product.findOneBy({id: req.body.productId}) 
        const quantityChange = req.body.quantityChange
        const updateType = req.body.type

        if(!user || !product) {
            return res.json(new ResponseHandler({message: !user ? `Wrong userId!` : `Wrong productId`}).returnError())
        }

        let log

        switch(updateType) {
            case 'Import':
                log = await logUpdateStock(user, product, quantityChange, updateType)

                product.quantity += quantityChange

                await product.save()

                break
            case 'Export':
                if(product.quantity < quantityChange) {
                    return res.json(new ResponseHandler({message: "Invalid stock input"}).returnError())
                } 
                log = await logUpdateStock(user, product, quantityChange, updateType)

                product.quantity -= quantityChange

                await product.save()

                break
            default:
                return res.json(new ResponseHandler({message: "Invalid stock input"}).returnError())
        }
     
        if(!log) {
            return res.json(new ResponseHandler({message: `Log ${updateType} stock failed!`}).returnError())
        }
        
        return res.json(new ResponseHandler({message: `${updateType} stock successfully!`}).returnSuccess())
    } catch (error) {
        return res.json(new ResponseHandler({}).returnInternal())
    }
}

export const stockController = {
    updateStock
}