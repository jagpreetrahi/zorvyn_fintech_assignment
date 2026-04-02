import CrudRepository from "./crud-repositories";
import { prisma } from "../lib/prisma";

class UserRepository extends CrudRepository {
    constructor() {
        super(prisma.user)
    }

    async getUserByEmail(email : string){
        const user = await prisma.user.findUnique({where : { email: email}})
        return user;
    }
}

export default UserRepository