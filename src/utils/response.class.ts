// utils/responseUtil.ts

interface ApiResponse<T> {
    status: string;
    data?: T;
    message?: string;
}

const successResponse = <T>(data: T): ApiResponse<T> => {
    return {
        status: 'success',
        data,
    };
};

const errorResponse = (message: string, errorDetails?: string): ApiResponse<null> => {
    return {
        status: 'error',
        message,
        ...(errorDetails && { errorDetails }),
    };
};

export { ApiResponse, successResponse, errorResponse };
