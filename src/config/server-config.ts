import dotenv from "dotenv"
import AppError from "../utils/error/app-error"
import { StatusCodes } from "http-status-codes"

dotenv.config()

if (!process.env.JWT_SECRET) {
  throw new AppError('JWT_SECRET is not defined in environment variables', StatusCodes.NOT_FOUND)
}

export const ServerConfig = {
    PORT : process.env.PORT,
    SALT_ROUNDS : Number(process.env.SALT_ROUNDS) || 10,
    JWT_EXPIRY: process.env.JWT_EXPIRY,
    JWT_SECRET: process.env.JWT_SECRET,
}