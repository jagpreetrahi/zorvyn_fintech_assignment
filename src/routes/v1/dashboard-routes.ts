import express from "express"
import {UserMiddleWare} from "../../middlewares"
import {DashBoardController} from "../../controllers"

const router = express.Router()

router.use(UserMiddleWare.checkAuth)
router.use(UserMiddleWare.restrictTo('ADMIN', 'ANALYST'),)

/** GET -> api/v1/dashboard/summary */
router.get('/summary', DashBoardController.getSummary)

/** GET -> api/v1/dashboard/category-total */
router.get('/category-totals', DashBoardController.categoryWise)

/**GET -> api/v1/dashBoard/recent-activity  */
router.get('/recent-activity', DashBoardController.recentActivity)

/**GET -> api/v1/dashBoard/monthly-trends */
router.get('/monthly-trends', DashBoardController.monthlyRecords)


export default router