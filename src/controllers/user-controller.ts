import { StatusCodes } from "http-status-codes";
import { UserService } from "../services";
import {Request, Response } from "express"
import { SuccessResponse, ErrorResponse } from "../utils/common";
import AppError from "../utils/error/app-error";

async function  signUp(req: Request, res: Response) {
    try {
        const user = await UserService.create({
            email : req.body.email,
            password : req.body.password
        })
        SuccessResponse.message = "User created Successfully"
        SuccessResponse.data = user;
     
        
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = error instanceof AppError 
        ? error.message          
        : 'Something went wrong' 

        ErrorResponse.error = error instanceof Error
        ? { message : error.message}
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

async function signIn(req: Request, res : Response) {
    try {
        const user = await UserService.signIn({
            email : req.body.email,
            password : req.body.password
        })
        SuccessResponse.message = "User signed In Successfully"
        SuccessResponse.data  = user;
      

        return res
              .status(StatusCodes.OK)
              .json(SuccessResponse)

    } catch (error) {
        ErrorResponse.message = error instanceof AppError 
        ? error.message          
        : 'Something went wrong' 

        ErrorResponse.error = error instanceof Error
        ? { message : error.message}
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

async function updateUserRole (req: Request, res: Response) {
    try {
        const user = await UserService.updateUserRole(
            req.body.id,
            req.body.role
        )
        SuccessResponse.message = 'User role updated successfully'
        SuccessResponse.data = user;


        return res
               .status(StatusCodes.OK)
               .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.message = error instanceof AppError 
        ? error.message          
        : 'Something went wrong' 

        ErrorResponse.error = error instanceof Error
        ? { message : error.message}
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

async function updateUserStatus(req: Request, res: Response) {
    try {
        const user = await UserService.updateUserStatus(
            req.body.id, 
            req.body.status
        )
        SuccessResponse.message = 'User status updated successfully'
        SuccessResponse.data = user;
 

        return res
               .status(StatusCodes.OK)
               .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.message = error instanceof AppError 
        ? error.message          
        : 'Something went wrong' 

        ErrorResponse.error = error instanceof Error
        ? { message : error.message}
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

async function  getUser(req: Request, res: Response) {
    try {
        const user = await UserService.getUser(req.params.id as string)

        SuccessResponse.message = 'User fetched successfully'
        SuccessResponse.data = user

        return res
               .status(StatusCodes.OK)
               .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.message = error instanceof AppError 
        ? error.message          
        : 'Something went wrong' 

        ErrorResponse.error = error instanceof Error
        ? { message : error.message}
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

async function  getAllUsers(req: Request, res: Response) {
    try {
        const user = await UserService.getAllUsers();

        SuccessResponse.message = 'Users fetched successfully'
        SuccessResponse.data = user

        return res
               .status(StatusCodes.OK)
               .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.message = error instanceof AppError 
        ? error.message          
        : 'Something went wrong' 

        ErrorResponse.error = error instanceof Error
        ? { message : error.message}
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

export const UserController = {
    signIn,
    signUp,
    updateUserRole,
    updateUserStatus,
    getAllUsers,
    getUser
}