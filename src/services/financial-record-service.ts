import FinancialRecord from "../repositories/financial-repositories";
import { StatusCodes } from "http-status-codes";
import AppError from "../utils/error/app-error";

const  financialRepo = new FinancialRecord();

//creating a record
async function createRecord(data : any, userId : string){
    try {
        const record = await financialRepo.create({
            ...data,
            createdById: userId // always set from the authenticated user
        });
        return record;
    } catch (error) {
        console.log("the record error is ", error)
        throw new AppError('Cannot create a new financial record', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

// this method is for viewing the single record 
async function getRecord(id : string){
   try {
       const findRecord = await financialRepo.get(id);

       if(!findRecord){
         throw new AppError("Record not found", StatusCodes.NOT_FOUND)
       }
       return findRecord
   } catch (error) {
        if(error instanceof AppError) throw error;
        throw new AppError("Something went wrong", StatusCodes.INTERNAL_SERVER_ERROR)
   }
}

// this method is for viewing the all records
async function getAllRecords(){
    try {
        const records = await financialRepo.getAll();

        if(!records || records.length === 0){
            throw new AppError("There is no any records to viewing it", StatusCodes.NOT_FOUND)
        }
        return records
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Something went wrong", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

// updating the record
async function updateRecord(id : string, record : any) {
    try {
        const findRecord = await financialRepo.get(id);
        if (!findRecord) {
            throw new AppError("No record find out to updated it", StatusCodes.NOT_FOUND)
        }
        
        const finalUpdatedRecord = await financialRepo.update(id, record)
        return finalUpdatedRecord;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Something went wrong", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

// deleting
async function  deleteRecord(id: string) {
    try {
        const findRecord = await financialRepo.get(id);

        if (!findRecord) {
            throw new AppError("No record found out to be deleted", StatusCodes.NOT_FOUND)
        }
        const record = await financialRepo.delete(id);
        return record
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Something went wrong", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function getRecordByFilter(filters : {
    type? : string,
    category?: string,
    startDate?: Date,
    endDate?: Date
}) {
    try {
        const filterRecord = await financialRepo.getFilterRecord(filters);
        if (!filterRecord || filterRecord.length === 0) {
            throw new AppError("No record found for given filter", StatusCodes.NOT_FOUND)
        }
        return filterRecord
    } catch (error) {
        if ( error instanceof AppError) throw error
        throw new AppError("something went wrong", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

export const FinancialService = {
    createRecord,
    updateRecord,
    deleteRecord,
    getAllRecords,
    getRecord,
    getRecordByFilter
}