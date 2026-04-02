import { StatusCodes } from "http-status-codes";
import UserRepository from "../repositories/user-repositories";
import AppError from "../utils/error/app-error";
import { Auth } from "../utils/common";

const userRepo = new UserRepository()

async function create(data: any) {
    try {
        const hashPassword = await Auth.hashPassword(data.password)
        const user = await userRepo.create({
            ...data,
            password : hashPassword,
            role: 'VIEWER',
            status : 'ACTIVE'
        });
        // not  returning the password in the response
        const { password, ...userWithoutPassword} = user
        return userWithoutPassword;
    } catch (error) {
        console.log("the user error is ", error)
        throw new AppError('Cannot create a new user object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function signIn(data : any) {
    try {
        const user = await userRepo.getUserByEmail(data.email)
        if(!user){
            throw new AppError("No user Found for the given email", StatusCodes.NOT_FOUND);
        }

        if(user.status === 'INACTIVE'){
            throw new AppError('User account is deactivated', StatusCodes.FORBIDDEN)
        }
        const passwordMatch = await Auth.checkPassword(data.password, user.password);
        console.log("Password Match" , passwordMatch)

        if(!passwordMatch){
            throw new AppError('Invalid password', StatusCodes.BAD_REQUEST)
        }

        const token = await Auth.createToken({id : user.id, email: user.email});
        return token;

    } catch (error) {
        if(error instanceof AppError) throw error;
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getUser(id: string){
   try {
      const user = await userRepo.get(id);

      if(!user){
         throw new AppError("User Not found", StatusCodes.NOT_FOUND);
      }
      return user;
   } catch (error) {
      if(error instanceof AppError) throw error;
      throw new AppError("Something went wrong", StatusCodes.INTERNAL_SERVER_ERROR)
   }
}

async function  getAllUsers() {
    try {
        const usersdata = await userRepo.getAll();
        return usersdata;
    } catch (error) {
        throw new AppError("Something went wrong", StatusCodes.INTERNAL_SERVER_ERROR);
    }

}

async function  updateUserRole(id: string, userRole: string) {
    try {
        const userFind = await userRepo.get(id);
        if(!userFind){
            throw new AppError("User not found to update the role", StatusCodes.NOT_FOUND)
        }
        const { role } = userFind;

        if(role === userRole) {
            throw new AppError("User role should not be same", StatusCodes.BAD_REQUEST)
        }
        const updateRole = await userRepo.update(id, {role : userRole})
        return updateRole

    } catch (error) {
        if(error instanceof AppError) throw error;
        throw new AppError("Something went wrong", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function  updateUserStatus(id: string, userStatus: string) {
    try {
        const userFind = await userRepo.get(id);
        if(!userFind){
            throw new AppError("User not found to update the role", StatusCodes.NOT_FOUND)
        }
        const { status } = userFind;

        if(status === userStatus) {
            throw new AppError("User role should not be same", StatusCodes.BAD_REQUEST)
        }
        const updateRole = await userRepo.update(id, {status : userStatus})
        return updateRole

    } catch (error) {
        if(error instanceof AppError) throw error;
        throw new AppError("Something went wrong", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

export const UserService = {
   create,
   signIn,
   updateUserRole,
   updateUserStatus,
   getAllUsers,
   getUser
}