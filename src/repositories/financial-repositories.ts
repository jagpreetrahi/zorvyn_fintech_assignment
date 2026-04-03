import CrudRepository from "./crud-repositories";
import { prisma } from "../lib/prisma";

class FinancialRecord extends CrudRepository {
    constructor() {
        super(prisma.financialRecord)
    }

    async getFilterRecord(filters: {
        type?: string,
        category?: string,
        startDate?: Date,
        endDate?: Date
    }) {
        return await this.model.findMany({
            where : {
                ...(filters.type && {type : filters.type}),
                ...(filters.category && {category: filters.category}),
                ...(filters.startDate && filters.endDate && {
                    data : {
                        gte : filters.startDate,
                        lte : filters.endDate
                    }
                })
            }
        })
    }
}

export default FinancialRecord