import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {ServerConfig} from "../../config"

function checkPassword(plainPassword : string, encryptedPassword : any){
    try {
        return bcrypt.compareSync(plainPassword, encryptedPassword)
    } catch (error) {
        console.log(error);
        throw error;
    }
}

function createToken(input : object){
    try {
        return jwt.sign({id : input}, ServerConfig.JWT_SECRET as string, { expiresIn: ServerConfig.JWT_EXPIRY as any});
    } catch (error) {
        console.log(error);
        throw error;
    }

}

function verifyToken(token : string){
    try {
        return jwt.verify(token, ServerConfig.JWT_SECRET as string)
    } catch (error) {
        console.log(error)
        throw error
    }
}

function hashPassword(password : string) {
    try {
        return bcrypt.hash(password, ServerConfig.SALT_ROUNDS)
    } catch (error) {
        console.log(error)
        throw error
    }
}
export const Auth = {
   checkPassword,
   verifyToken,
   createToken,
   hashPassword
}