export const ErrorResponse = (message : string, error: any) => ({
    success: false,
    message,
    error : error instanceof Error ? { message: error.message } : { message: 'Unknown error' }
})