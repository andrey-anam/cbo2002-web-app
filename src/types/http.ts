export type THttpStatusOk =  200;
export type THttpStatusBadRequest = 400;
export type THttpStatusNotFound = 404;
export type THttpStatusUnauthorized = 401;
export type THttpStatusInternalServerError = 500;
export type THttpStatusServiceUnavailable = 503;
export type THttpStatusNoContent = 204;

export type THttpStatusSuccess = 
    | THttpStatusOk
    | THttpStatusNoContent;

export type THttpStatusError = 
    | THttpStatusBadRequest
    | THttpStatusNotFound
    | THttpStatusUnauthorized
    | THttpStatusInternalServerError
    | THttpStatusServiceUnavailable;

export type THttpStatus = 
    | THttpStatusSuccess
    | THttpStatusError;

export type THttpResponseSingleData<T extends {[x: string]: any} = any> = T;
export type THttpResponseMultiData<T extends {[x: string]: any} = any> = T[];

export type THttpResponsePagination = {
    page: number;
    perPage: number;
    items: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
}

export type THttpResponseError = {
    success: false;
    code: string;
    message: string;
    cause?: any;
}

export type THttpResponseSingleSuccess<T extends {[x: string]: any} = any> = {
    success: true;
    message: string;
    data: THttpResponseSingleData<T>
}

export type THttpResponseMultiSuccess<T extends {[x: string]: any} = any> = {
    success: true;
    message: string;
    data: THttpResponseMultiData<T>;
    pagination: THttpResponsePagination;
}

export type THttpResponseSuccess<T extends {[x: string]: any} = any> = 
    | THttpResponseSingleSuccess<T>
    | THttpResponseMultiSuccess<T>;

export type THttpResponse<T = any> = 
    | THttpResponseSuccess<T>
    | THttpResponseError;
