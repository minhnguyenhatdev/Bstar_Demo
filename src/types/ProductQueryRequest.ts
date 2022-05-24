enum Sort {
    Category = "Category",
    Name = "Name",
    Price = "Price"
}

export class ProductQueryRequest {
    pageIndex: number
    pageLimit: number
    sortBy?: Sort
}