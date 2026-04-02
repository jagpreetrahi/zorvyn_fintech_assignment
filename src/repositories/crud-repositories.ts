import { StatusCodes } from "http-status-codes";
import AppError from "../utils/error/app-error";

type PrismModel = {
   create : Function
   findUnique : Function
   findMany : Function
   update: Function
   delete : Function
}

class CrudRepository {
    model: PrismModel;
    constructor(model: PrismModel) {
        this.model = model
    }

    async create(data: object){
        const response = await this.model.create({data});
        return response;
    }

    async get(id: string){
        const response = await this.model.findUnique({
            where : { id : id}
        })
        if(!response){
            throw new AppError('Not able to fund the resource', StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async getAll(){
        const response = await this.model.findMany()
        return response
    }

    async update(id : string, data: any){
        const response = await this.model.update({
            where : {id : id },
            data : data 
        })
        return response
    }

    async delete (id: string) {
        const response = await this.model.delete({
            where : {
                id : id
            }
        })
        return response;
    }
}

export default CrudRepository