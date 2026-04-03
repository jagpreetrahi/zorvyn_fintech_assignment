import {FinancialService} from "../services/financial-record-service";
import { StatusCodes } from "http-status-codes";
import AppError from "../utils/error/app-error";
import { Request, Response } from "express";
import { SuccessResponse, ErrorResponse } from "../utils/common";

async function createRecord(req: Request, res: Response) {
    try {
        const record = await FinancialService.createRecord({
            amount: req.body.amount,
            type : req.body.type,
            category: req.body.category,
            date: req.body.date,
            description: req.body.description
        }, req.user.id)

        return res
               .status(StatusCodes.CREATED)
               .json(SuccessResponse("Record created Successfully", record))
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

async function  getRecord(req: Request, res: Response) {
    try {
        const record = await FinancialService.getRecord(req.params.id as string)
        return res
               .status(StatusCodes.OK)
               .json(SuccessResponse('Record fetched successfully', record))
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

async function  getAllRecords(_req: Request, res: Response) {
    try {
        const records = await FinancialService.getAllRecords();
        return res
               .status(StatusCodes.OK)
               .json(SuccessResponse('Records fetched successfully', records))
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

async function  updateRecord(req: Request, res: Response) {
    try {
        const record = await FinancialService.updateRecord(req.params.id as string, {
            amount : req.body.amount,
            type: req.body.type,
            category: req.body.category,
            date: req.body.date,
            description: req.body.description,
            updatedById: req.user.id
        })

        return res
              .status(StatusCodes.OK)
              .json(SuccessResponse("Record updated Successfully", record))
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

async function getRecordByFilter(req: Request, res: Response) {
    try {

        const filterRecord = await FinancialService.getRecordByFilter({
            type: req.query.type as string,
            startDate: req.body.startDate ? new Date(req.query.startDate as string) : undefined,
            endDate: req.body.endDate ? new Date(req.query.endDate as string) : undefined,
            category: req.query.category as string
        })

        return res
              .status(StatusCodes.OK)
              .json(SuccessResponse("Fecthed the records with filters successfully", filterRecord))
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

async function deleteRecord(req: Request, res: Response) {
  try {
    const record = await FinancialService.deleteRecord(req.params.id as string)
    return res
        .status(StatusCodes.OK)
        .json(SuccessResponse( 'Record deleted successfully', record))
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

export const FinancialController = {
    createRecord,
    updateRecord,
    getAllRecords,
    getRecord,
    getRecordByFilter,
    deleteRecord
}