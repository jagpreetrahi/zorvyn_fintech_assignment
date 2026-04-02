import CrudRepository from "./crud-repositories";
import { prisma } from "../lib/prisma";

class FinancialRecord extends CrudRepository {
    constructor() {
        super(prisma.financialRecord)
    }
}

export default FinancialRecord