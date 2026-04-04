import express from "express"
import {UserMiddleWare} from '../../middlewares'
import {UserController} from "../../controllers"
const router = express.Router()

/**  /api/v1/auth/signUp */
router.post('/signUp', UserMiddleWare.validateAuthRequest, UserController.signUp)

/** /api/v1/auth/signIn  */
router.post('/signIn', UserMiddleWare.validateAuthRequest, UserController.signIn)


export default router