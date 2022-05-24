import { Response } from 'express'
import { Send } from 'express-serve-static-core';

export interface IResponse<T> extends Response{
    json: Send<T, this>
}