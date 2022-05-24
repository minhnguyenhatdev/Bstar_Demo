import { Type } from "../entities/stockLog"

export class ChangeStockRequest {
    productId: number
    userId: number
    quantityChange: number
    type: Type
}