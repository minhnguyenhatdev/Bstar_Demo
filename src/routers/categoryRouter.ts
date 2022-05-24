import { Router } from 'express';
import { validateCategoryFormat } from '../middlewares/checkTypeOfRequestBody';
import { categoryController } from '../controllers/categoryController';
const router = Router();

/**
 * @swagger
 * components:
 *      schema:
 *          category:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                      default: Comedy
 */

/**
 * @swagger
 * /api/category/:
 *  get:
 *      summary: 'get product list'
 *      tags: [CATEGORY]
 *      description: 'Return an array of Category object'
 *      responses:
 *          '202':
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: array
 * 
 */
 router.get("/", categoryController.getAllCategory)


/**
 * @swagger
 * /api/category/:
 *  post:
 *      summary: 'add Category.'
 *      tags: [CATEGORY]
 *      description: 'add Category.'
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/category'
 *      responses:
 *          '200':
 *              description: 'add Category'
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: object
 */
router.post("/", validateCategoryFormat, categoryController.addCategory)

module.exports = router;