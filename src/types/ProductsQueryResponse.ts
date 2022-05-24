import { Product } from '../entities/product';

export class ProductsQueryResponse {
    currentIndex?: number
    currentLimit?: number
    pageTotal?: number
    products?: Product[]

    constructor(products?: Product[], currentIndex? : number, currentLimit? : number, pageTotal? : number){
        this.currentIndex = currentIndex ? currentIndex : undefined
        this.currentLimit = currentLimit ? currentLimit : undefined
        this.pageTotal =  pageTotal ? pageTotal : undefined
        this.products = products ? products: undefined
    }
}