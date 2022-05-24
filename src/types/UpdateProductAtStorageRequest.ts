import { IsNotEmpty, IsNumber, IsObject, IsPositive, ValidateNested } from "class-validator"
import { StoragePlacement } from "../entities/storagePlacement"

export class UpdateProductAtStorageRequest {
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @ValidateNested()
    productId: number

    @IsObject()
    @ValidateNested()
    storagePlacement: StoragePlacement
}