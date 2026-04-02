import { StatusCodes } from "http-status-codes";
import { ErrorResponse } from "../utils/common";
import AppError from "../utils/error/app-error";
import { Request, Response, NextFunction } from "express";
import { Auth } from "../utils/common";
import UserRepository from "../repositories/user-repositories";
import { JwtPayload } from "jsonwebtoken";

const userRepo = new UserRepository();


function validateAuthRequest(req: Request, res: Response, next: NextFunction) {
    if(!req.body.email) {
        ErrorResponse.message = 'Something went wrong while authenticating user';
        ErrorResponse.error = new AppError('Email not found in the incoming request in the correct form', StatusCodes.BAD_REQUEST);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse);
    }

    if(!req.body.password) {
        ErrorResponse.message = 'Something went wrong while authenticating user';
        ErrorResponse.error = new AppError('password not found in the incoming request in the correct form', StatusCodes.BAD_REQUEST);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse);
    }

    next()
}

async function checkAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers['authorization']?.split(' ')[1]

        if(!token){
            throw new AppError("Token not found", StatusCodes.UNAUTHORIZED)
        }

        const decoded = Auth.verifyToken(token) as JwtPayload
        if(!decoded || !decoded.id){
              throw new AppError('Invalid token', StatusCodes.UNAUTHORIZED)
        }
      

        const user = await userRepo.get(decoded.id) 
        if(!user) {
            throw new AppError("user not found", StatusCodes.NOT_FOUND)
        }

        if(user.status === 'INACTIVE') {
            throw new AppError("User account is deactivated", StatusCodes.FORBIDDEN)
        }

        req.user = user 
        next()

    } catch (error) {
        ErrorResponse.message = error instanceof AppError
        ? error.message
        : 'Something went wrong'

        ErrorResponse.error = error instanceof Error
        ? { message: error.message }
        : { message: 'Unknown error' }
        
        return res
        .status(
            error instanceof AppError
            ? error.statusCode
            : StatusCodes.INTERNAL_SERVER_ERROR
        )
        .json(ErrorResponse)
    }
}

// middleware for role checking

function restrictTo(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if(!roles.includes(req.user.role)) {
        ErrorResponse.message = 'You do not have permission to perform this action'
           ErrorResponse.error = { message: 'Forbidden - insufficient role' }
        return res.status(StatusCodes.FORBIDDEN).json(ErrorResponse)
    }
    next()
  }
}

export const UserMiddleWare = {
    validateAuthRequest,
    checkAuth,
    restrictTo
}
