import { StatusCodes } from "http-status-codes";
import AppError from "../utils/error/app-error";
import { prisma } from "../lib/prisma";


async function getSummary() {
   // getting the summary based on the total income , expenses, and the net balance.
   try {
        const income = await prisma.financialRecord.aggregate({
            where : {type : 'INCOME'},
            _sum : {amount : true}
        })

        const expenses = await prisma.financialRecord.aggregate({
            where: {type: 'EXPENSE'},
            _sum: { amount : true}
        })

        const totalIncome = income._sum.amount || 0;
        const totalExpense = expenses._sum.amount || 0;
        const netBalance = totalIncome - totalExpense;

        return {
            totalExpense,
            totalIncome,
            netBalance
        }
   } catch (error) {
       throw new AppError("Could not provide the summary", StatusCodes.INTERNAL_SERVER_ERROR)
   }
}

async function getCategoriesWiseTotals() {
    try {
        const categoryTotal = await prisma.financialRecord.groupBy({
            by : ['category'],
            _sum: {amount: true}
        })
        return categoryTotal
    } catch (error) {
        throw new AppError("Could not fetch the category total", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function getRecentActivity() {
    try {
        const activity = await prisma.financialRecord.findMany({
            orderBy : {date : 'desc'},
            take : 10 // last 10 records
        })
        
        if (activity.length === 0 ){
            throw new AppError("No recent Activity", StatusCodes.NOT_FOUND)
        }
        return activity
    } catch (error) {
        if (error instanceof AppError) throw error
        throw new AppError("COuld not fetch the recent activity", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function monthlyTrendsRecords() {
    try {
        const records  = await prisma.financialRecord.findMany({
            orderBy : {date : 'asc'},
            select : {amount : true, date : true, type : true}
        })

        // group by monthly
        const trends = records.reduce((acc:any, record) => {
           const month = record.date.toISOString().slice(0,7) // "2026-04"

           if(!acc[month]) {
               acc[month] = {income : 0, expense : 0}
           }

           if(record.type === 'INCOME') {
              acc[month].income += record.amount
           }
           else {
              acc[month].expense += record.amount
            }

            return acc;
        }, {})
        return trends;
    } catch (error) {
       throw new AppError("Cound not fetch the monthly trends", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

export const DashBoardService = {
    getSummary,
    getCategoriesWiseTotals,
    getRecentActivity,
    monthlyTrendsRecords
}