import { Product } from "../entities/product";
import { StockLog, Type } from "../entities/stockLog";
import { User } from "../entities/user";

export const logUpdateStock = async(user: User, product: Product, quantityChange: number, type: string): Promise<StockLog | undefined> => {
    try {
        const newImportLog = StockLog.create({
            previousQuantity: product.quantity,
            newQuantity: type === 'Import' ? product.quantity+quantityChange :  product.quantity-quantityChange,
            userId: user.id,
            productId: product.id,
            type: type === 'Import' ? Type.Import : Type.Export
        })

        await newImportLog.save()

        return newImportLog
    } catch (error) {
        console.log(error)
        return undefined
    }
}

