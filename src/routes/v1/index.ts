import express from "express"
import authRoutes from "./auth-routes"
import userRoutes from "./user-routes"
import recordRoutes from './records-routes'
import dashBoardRoutes from './dashboard-routes'
const router = express.Router()

router.use('/auth', authRoutes)

router.use('/user', userRoutes)

router.use('/record', recordRoutes)

router.use('/dashboard', dashBoardRoutes)


export default router