import express from "express"
import {UserMiddleWare} from "../../middlewares"
import {FinancialController} from "../../controllers"

const router = express.Router()

/** POST -> api/v1/record - Admin role */
router.post('/', UserMiddleWare.checkAuth, UserMiddleWare.restrictTo('ADMIN'), FinancialController.createRecord)

/**GET - api/v1/record/ - All role */
router.get('/', UserMiddleWare.checkAuth, UserMiddleWare.restrictTo('VIEWER', 'ANALYST', 'ADMIN'), FinancialController.getAllRecords)

/** GET - api/v1/record/filters - Admin and Analyst */
router.get('/filter', UserMiddleWare.checkAuth, UserMiddleWare.restrictTo('ANALYST', 'ADMIN'), FinancialController.getRecordByFilter)

/** GET - api/v1/record/:id - All role */
router.get('/:id', UserMiddleWare.checkAuth, UserMiddleWare.restrictTo('VIEWER', 'ANALYST', 'ADMIN'), FinancialController.getRecord)

/** PUT - api/v1/record/:id - admin only */
router.put('/:id', UserMiddleWare.checkAuth, UserMiddleWare.restrictTo('ADMIN'), FinancialController.updateRecord)

/*DELETE - api/v1/record/:id - admin role */
router.delete('/:id', UserMiddleWare.checkAuth, UserMiddleWare.restrictTo('ADMIN'), FinancialController.deleteRecord)

export default router