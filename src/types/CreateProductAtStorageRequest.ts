import { IsObject, ValidateNested } from "class-validator"
import { Product } from "../entities/product"
import { StoragePlacement } from "../entities/storagePlacement"

export class CreateProductAtStorageRequest {
    @IsObject()
    @ValidateNested()
    product: Product

    @IsObject()
    @ValidateNested()
    storagePlacement: StoragePlacement
}