import { IStatusesResponse } from './IStatusesResponse';

export class FieldError implements IStatusesResponse {
    code: number
    success: boolean

    field: string
    message: string
}