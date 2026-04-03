import { SuccessResponse, ErrorResponse } from "../utils/common";
import {DashBoardService} from "../services";
import AppError from "../utils/error/app-error";
import { StatusCodes } from "http-status-codes";
import { Response, Request } from "express";

async function getSummary(_req: Request, res: Response) {
    try {
        const summary = await DashBoardService.getSummary()
        return res
              .status(StatusCodes.OK)
              .json(SuccessResponse("Summary fetched successfully", summary))
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

async function categoryWise(_req: Request, res: Response) {
    try {
        const category = await DashBoardService.getCategoriesWiseTotals();
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse( "Category wise record fetched successfully", category))
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

async function recentActivity(_req: Request, res: Response) {
    try {
        const activity = await DashBoardService.getRecentActivity()
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse("Fetched Activity SuccessFully", activity))
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

async function  monthlyRecords(_req: Request, res: Response) {
    try {
        const records = await DashBoardService.monthlyTrendsRecords()
        return res
             .status(StatusCodes.OK)
             .json(SuccessResponse("Monthly records fetched successfully", records))
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

export const DashBoardController = {
    getSummary,
    monthlyRecords,
    recentActivity,
    categoryWise
}