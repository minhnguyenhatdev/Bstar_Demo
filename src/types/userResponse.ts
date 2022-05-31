import { User } from './../entities/user';
import { IStatusesResponse } from "./IStatusesResponse"

export class UserResponse implements IStatusesResponse {
    code: number
    success: boolean
    message: string

    user?: User
}
