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
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse("User created successfully", user));
    } catch (error) {
        return res
            .status(
                error instanceof AppError
                ? error.statusCode
                : StatusCodes.INTERNAL_SERVER_ERROR 
            )
            .json(ErrorResponse(error instanceof AppError ? error.message : "Something went wrong", error))
    }
}

async function signIn(req: Request, res : Response) {
    try {
        const user = await UserService.signIn({
            email : req.body.email,
            password : req.body.password
        })
        return res
              .status(StatusCodes.OK)
              .json(SuccessResponse("User signed In Successfully", user))

    } catch (error) {
      return res
            .status(
                error instanceof AppError
                ? error.statusCode
                : StatusCodes.INTERNAL_SERVER_ERROR 
            )
            .json(ErrorResponse(error instanceof AppError ? error.message : "Something went wrong", error))
    }
    
}

async function updateUserRole (req: Request, res: Response) {
    try {
        const user = await UserService.updateUserRole(
            req.body.id,
            req.body.role
        )
        return res
               .status(StatusCodes.OK)
               .json(SuccessResponse( 'User role updated successfully', user))
    } catch (error) {
        return res
            .status(
                error instanceof AppError
                ? error.statusCode
                : StatusCodes.INTERNAL_SERVER_ERROR 
            )
            .json(ErrorResponse(error instanceof AppError ? error.message : "Something went wrong", error))
    }
}

async function updateUserStatus(req: Request, res: Response) {
    try {
        const user = await UserService.updateUserStatus(
            req.body.id, 
            req.body.status
        )
      
        return res
               .status(StatusCodes.OK)
               .json(SuccessResponse( 'User status updated successfully', user))
    } catch (error) {
        return res
            .status(
                error instanceof AppError
                ? error.statusCode
                : StatusCodes.INTERNAL_SERVER_ERROR 
            )
            .json(ErrorResponse(error instanceof AppError ? error.message : "Something went wrong", error))
    }
}

async function  getUser(req: Request, res: Response) {
    try {
        const user = await UserService.getUser(req.params.id as string)
        return res
               .status(StatusCodes.OK)
               .json(SuccessResponse('User fetched successfully', user))
    } catch (error) {
        return res
            .status(
                error instanceof AppError
                ? error.statusCode
                : StatusCodes.INTERNAL_SERVER_ERROR 
            )
            .json(ErrorResponse(error instanceof AppError ? error.message : "Something went wrong", error))
    }
}

async function  getAllUsers(_req: Request, res: Response) {
    try {
        const user = await UserService.getAllUsers();
        return res
               .status(StatusCodes.OK)
               .json(SuccessResponse('Users fetched successfully', user))
    } catch (error) {
        return res
            .status(
                error instanceof AppError
                ? error.statusCode
                : StatusCodes.INTERNAL_SERVER_ERROR 
            )
            .json(ErrorResponse(error instanceof AppError ? error.message : "Something went wrong", error))
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