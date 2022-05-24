import { StockLog } from '../entities/stockLog';
import { CreateProductAtStorageRequest } from 'src/types/CreateProductAtStorageRequest';
import { StoragePlacement } from '../entities/storagePlacement';
import { Product } from './../entities/product';
import { UpdateProductAtStorageRequest } from './../types/UpdateProductAtStorageRequest';


const fakeStorage = {
    area: [1,2,3,4,5],
    row: [1,2,3,4,5],
    index: [1,2,3,4,5],
}
// one product can be added to multi placements
// if product is not existed in db -> false
export const updateProductAtStorage = async(productAndPlacements: UpdateProductAtStorageRequest): Promise<number> => {
    try {
        const productExisted = await Product.findOneBy({id: productAndPlacements.productId})

        //check if product is existed in db
        if(!productExisted) {
            return 0
        }
        if(!checkValidStoragePlacement(productAndPlacements.storagePlacement)) return 0

        const processUpdateStorage =  await proccessUpdateProductQuantityAtStorage(productAndPlacements.productId, productAndPlacements.storagePlacement)

        if(!processUpdateStorage) return 0

        const newQuantity = await updateProductQuantityAfterAddedToStorage(productExisted.id)
        
        if(!newQuantity) return 0

        return newQuantity
    } catch (error) {
        console.log(error)
        return 0
    }
}

// one product can be added to multi placements
// if product is not existed in db -> create new
export const createProductAtStorage = async(productAndPlacements: CreateProductAtStorageRequest): Promise<Boolean | number> => {
    try {
        const  newProduct = Product.create(productAndPlacements.product)
        if(!newProduct) return false

        await newProduct.save()

        if(!checkValidStoragePlacement(productAndPlacements.storagePlacement)) return false

        if(!(await proccessUpdateProductQuantityAtStorage(newProduct.id, productAndPlacements.storagePlacement))) return false

        const newQuantity = await updateProductQuantityAfterAddedToStorage(newProduct.id)

        if(!newQuantity) return false

        return newQuantity
    } catch (error) {
        console.log(error)
        return false
    }
}

const proccessUpdateProductQuantityAtStorage = async(productId: number, newProductDataAtStorage: StoragePlacement): Promise<Boolean> => {
    try {
        const findLocation = await StoragePlacement.findOne({
            where: {
                area: newProductDataAtStorage.area,
                row: newProductDataAtStorage.row,
                index: newProductDataAtStorage.index,
                productId
            }
        })

        if(findLocation) {
            findLocation.quantity = newProductDataAtStorage.quantity
            await findLocation.save()
            return true
        }

        const createdQuantityOfProductInStorage = StoragePlacement.create({...newProductDataAtStorage, productId})
        await createdQuantityOfProductInStorage.save()
        
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

const updateProductQuantityAfterAddedToStorage = async(productId: number): Promise<number> => {
    try {
        const product =  await Product.findOne({
            relations: {
                storagePlacement: true
            },
            where: {
                id: productId
            }
        })
        if(!product) return 0
        
        let newQuantity = 0
        product.storagePlacement.map(place => {
            newQuantity += place.quantity
        })

        product.quantity = newQuantity
        await product?.save()

        return product.quantity
    } catch (error) {
        console.log(error)
        return 0
    }
}



const checkValidStoragePlacement = (place: StoragePlacement) => {
    if(!fakeStorage.area.includes(place.area)) return false
    if(!fakeStorage.row.includes(place.row)) return false
    if(!fakeStorage.index.includes(place.index)) return false
    return true
}