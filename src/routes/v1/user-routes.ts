import express from "express"
import {UserMiddleWare} from "../../middlewares"
import { UserController } from "../../controllers"
const router = express.Router()

/** Get -> /api/v1/user - admin only */
router.get('/', UserMiddleWare.checkAuth,  UserMiddleWare.restrictTo('ADMIN'), UserController.getAllUsers)

/** Get -> /api/v1/user/:id - All roles */
router.get('/:id', UserMiddleWare.checkAuth,  UserMiddleWare.restrictTo('ADMIN', 'VIEWER', 'ANALYST'), UserController.getUser)

/**  PATCH -> /api/v1/user/:id/role - admin role */
router.patch('/:id/role', UserMiddleWare.checkAuth, UserMiddleWare.restrictTo('ADMIN'), UserController.updateUserRole)

/**  PATCH -> /api/v1/user/:id/status - admin role */
router.patch('/:id/status', UserMiddleWare.checkAuth, UserMiddleWare.restrictTo('ADMIN'), UserController.updateUserStatus)

export default router