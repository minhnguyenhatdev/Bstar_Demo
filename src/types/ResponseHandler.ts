import { StatusCode } from './../commons/StatusCodeEnum';
import { IStatusesResponse } from './IStatusesResponse';

export class ResponseHandler<T = any> extends IStatusesResponse{
    code: number
    success: boolean
    message: string

    data?: T

    constructor(input: inputResponse<T>){
        super(input.code, input.success, input.message)
        this.data = input.data ? input.data : undefined
    }
    
    public returnSuccess = () => {
        return new ResponseHandler({code: this.code ? this.code : StatusCode.Success, success: true, message: this.message, data: this.data })
    }

    public returnError = () => {
        return new ResponseHandler({code: this.code ? this.code : StatusCode.Error, success: false , message: this.message })
    }

    public returnInternal = () => {
        return new ResponseHandler({code: this.code ? this.code : StatusCode.Internal, success: false, message: this.message ? this.message : "Internal server error" })
    }

}

type inputResponse<T> = {
    code?: StatusCode,
    success?: boolean,
    message?: string,
    data?: T
}