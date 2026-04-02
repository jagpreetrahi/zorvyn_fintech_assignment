import { StatusCodes } from "http-status-codes";

class AppError extends Error {
    statusCode: StatusCodes;
    explanation: string | undefined;
    constructor(message: string | undefined, statusCode: StatusCodes){
        super(message);
        this.statusCode = statusCode;
        this.explanation = message
    }
}

export default AppError