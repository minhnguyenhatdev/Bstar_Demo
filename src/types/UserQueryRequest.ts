enum Sort {
    Name = "Name"
}

export class UserQueryRequest {
    pageIndex: number
    pageLimit: number
    sortBy?: Sort
    searchInput?: string
}