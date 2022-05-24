import { StatusCode } from "../commons/StatusCodeEnum"

export class IStatusesResponse {
    code?: StatusCode
    success?: boolean
    message?: string

    constructor(code?: number, success?: boolean, message?: string) {
        this.code = code
        this.success = success 
        this.message = message 
    }
}
