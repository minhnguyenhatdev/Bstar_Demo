import { User } from '../entities/user';
export class UsersQueryResponse {
    currentIndex?: number
    currentLimit?: number
    pageTotal?: number
    users?: User[]

    constructor(users?: User[], currentIndex? : number, currentLimit? : number, pageTotal? : number){
        this.currentIndex = currentIndex ? currentIndex : undefined
        this.currentLimit = currentLimit ? currentLimit : undefined
        this.pageTotal =  pageTotal ? pageTotal : undefined
        this.users = users ? users: undefined
    }
}