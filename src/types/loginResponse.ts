import { IStatusesResponse } from "./IStatusesResponse"

export class LoginResponse implements IStatusesResponse {
    code: number
    success: boolean
    message: string

    access_token?: string
}