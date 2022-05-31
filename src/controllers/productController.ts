import { ProductsQueryResponse } from '../types/ProductsQueryResponse';
import { Request } from 'express'
import { IRequest } from '../types/IRequest';
import { IResponse } from '../types/IResponse'
import { Product } from '../entities/product';
import { queryProductService } from '../services/productServices';
import { ResponseHandler } from '../types/ResponseHandler';

//GET api/product/
const getAllProducts = async(_req : Request, res: IResponse<ResponseHandler<Product[]>>): Promise<IResponse<ResponseHandler<Product[]>>> => {
    try {
        const products: Product[] = await Product.find({
            relations:{
                category:true
            }
        })

        //failed to find product from db
        if(!products) {
            return res.json(new ResponseHandler({message: "Get products failed!"}).returnError())
        }

        //all ok
        return res.json(new ResponseHandler<Product[]>({data: products, message: "Get products successfully!"}).returnSuccess())

    } catch (error) {
        return res.json(new ResponseHandler({}).returnInternal())
    }
}

//GET api/product/:id
const findOneProduct = async(req : Request,res: IResponse<ResponseHandler<Product>>): Promise<IResponse<ResponseHandler<Product>>> => {
    try {
        //convert request param id from string to number
        const id: number = +req.params.id
        
        //check if id input is invalid (not a number) or null
        if(isNaN(id) || !id) {
            return  res.json(new ResponseHandler({message: "Find product failed!"}).returnError())
        }

        const product = await Product.findOneBy({id})
        
        //product not found
        if(!product) {
            return  res.json(new ResponseHandler({message: "Product not found!"}).returnError())
        }

        //all ok
        return  res.json(new ResponseHandler({message: "Find product successfully!", data: product}).returnSuccess())
    } catch (error) {
        console.log(error)
        return res.json(new ResponseHandler({}).returnInternal())
    }
}

//POST api/product/
const addProduct = async(req : IRequest<Product>, res: IResponse<ResponseHandler<Product>>): Promise<IResponse<ResponseHandler<Product>>> => {
    try {
        const product = req.body
        const newProduct = Product.create(product)

        await newProduct.save()

        return res.json(new ResponseHandler({message: "Created product successfully!", data: product}).returnSuccess())
    } catch (error) {
        console.log(error)
        return res.json(new ResponseHandler({}).returnInternal())
    }
}

//PUT api/product/:id
const updateProduct = async(req : IRequest<Product>, res: IResponse<ResponseHandler<boolean>>): Promise<IResponse<ResponseHandler<boolean>>> => {
    try {
        //convert request param id from string to number
        const id: number = +req.params.id

        const existingProduct = await Product.findOneBy({id})

        //no product found by id
		if (!existingProduct) {
            return res.json(new ResponseHandler({message: "No product found to update!"}).returnError())
        }
 
        //found product and update
        await Product.update({id}, {...req.body})

        return res.json(new ResponseHandler({message: "Updated product successfully!"}).returnSuccess())
    } catch (error) {
        console.log(error)
        return res.json(new ResponseHandler({}).returnInternal())
    }
}

//DELETE api/product/:id
const deleteProduct = async(req : IRequest<Product>, res: IResponse<ResponseHandler<boolean>>): Promise<IResponse<ResponseHandler<boolean>>> => {
    try {
        //convert request param id from string to number
        const id: number = +req.params.id

        //check if id input is invalid (not a number) or null
        if(isNaN(id) || !id) {
            res.json(new ResponseHandler({message: "Wrong product id!"}).returnError())
        }

        const existingProduct = await Product.findOneBy({id})

        //no product found by id
        if(!existingProduct) {
            return res.json(new ResponseHandler({message: "Delete product failed!"}).returnError())
        }

        await Product.delete({id})

        return res.json(new ResponseHandler({message: "Deleted product successfully!"}).returnSuccess())
    } catch (error) {
        console.log(error)
        return res.json(new ResponseHandler({}).returnInternal())
    }
}


//paginating & sort product list
//input: page number & limit product per page 
//optional: sort by Category | Name | Price & sort order by "descending" or "ascending"
const queryProduct = async(req : Request, res: IResponse<ResponseHandler<ProductsQueryResponse>>): Promise<IResponse<ResponseHandler<ProductsQueryResponse>>> => {
    try {
        //initializing queries value
        let sortBy: string | undefined = undefined
        let sortOrder = "descending"

        //change sortBy, sortOrder to given value if they are in request queries
        if(req.query.sortBy) sortBy = req.query.sortBy as string
        if(req.query.sortOrder) sortOrder = req.query.sortOrder as string
        
        //convert queries in request from string to number
        const pageIndex: number = req.query.pageIndex ? +req.query.pageIndex : 1
        const pageLimit: number = req.query.pageLimit ? +req.query.pageLimit : 10

        //get pageTotal from req.query passed from middleware
        const pageTotal: number = req.query.pageTotal ? +req.query.pageTotal : 1
        const searchInput: string = req.query.searchInput ? req.query.searchInput as string : ''

        //check if current pageIndex lower than pageTotal
        if(pageIndex > pageTotal) {
            return res.json(new ResponseHandler({message: "Invalid query!"}).returnError())
        }

        //query product
        const products = (sortBy ? await queryProductService(pageIndex, pageLimit, sortBy, sortOrder, searchInput) : await queryProductService(pageIndex, pageLimit))
        if(!products) {
            return res.json(new ResponseHandler({message: "Invalid query!"}).returnError())
        }

        

        //define result from queried product list to ProductsQueryResponse object type
        const result = new ProductsQueryResponse(products, pageIndex, pageLimit, pageTotal)

        return res.json(new ResponseHandler({message: "Queried successfully!", data: result}).returnSuccess())
    } catch (error) {
        return res.json(new ResponseHandler({}).returnInternal())
    }
}

export const productController = {
    getAllProducts,
    addProduct,
    findOneProduct,
    updateProduct,
    deleteProduct,
    queryProduct
}
