import { Product } from '../entities/product';

// db processing

//get number of product object in db
export const numberOfProduct = async(): Promise<number> => {
    try {
        const products = await Product.find()
        return products.length
    } catch (error) {
        return 0
    }
}


//paginating product list
//input: page number & limit product per page 
//optional: sort by Category | Name | Price
export const queryProductService = async (pageIndex: number, pageLimit: number, sortBy?: String, sortOrder?: String): Promise<Product[]> => {
    try {
        //create number of product to skip on db based on pageIndex and pageLimit
        const skipNumber = (pageIndex-1)*pageLimit

        let products: Product[]

        switch(sortBy) {
            case "Name": {
                products = await Product.find({
                    relations: {
                        category: true
                    },
                    order: {
                        name: sortOrder === "ascending" ? "ASC": "DESC"
                    },
                    take: pageLimit,
                    skip: skipNumber
                })
                break;
            }
            case "Price": {
                products = await Product.find({
                    relations: {
                        category: true
                    },
                    order: {
                        price: sortOrder === "ascending" ? "ASC": "DESC"
                    },
                    take: pageLimit,
                    skip: skipNumber
                })
                break;
            }
            case "Released": {
                products = await Product.find({
                    relations: {
                        category: true
                    },
                    order: {
                        released: sortOrder === "ascending" ? "ASC": "DESC"
                    },
                    take: pageLimit,
                    skip: skipNumber
                })
                break;
            }
            case "Category": {
                products = await Product.find({
                    relations: {
                        category: true
                    },
                    order: {
                        categoryId: sortOrder === "ascending" ? "ASC": "DESC"
                    },
                    take: pageLimit,
                    skip: skipNumber
                })
                break;
            }
            //default is sort by date
            default: {
                products = await Product.find({
                    relations: {
                        category: true
                    },
                    order: {
                        createdAt: sortOrder === "ascending" ? "ASC": "DESC"
                    },
                    take: pageLimit,
                    skip: skipNumber
                })
            }
        }
        
        return products
    } catch (error) {
        console.log(error)
        return []
    }
}