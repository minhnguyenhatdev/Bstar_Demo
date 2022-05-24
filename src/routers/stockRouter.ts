import { storageController } from './../controllers/storageController';
import {Router} from 'express';
import { validateCreateProductPlacementFormat, validateUpdateProductPlacementFormat } from '../middlewares/checkTypeOfRequestBody';
import { verifyManager } from '../middlewares/authorization';

const router = Router();

/**
 * @swagger
 * components:
 *      schema:
 *          createStock:
 *              type: object
 *              properties:
 *                  product:
 *                      $ref: '#components/schema/product'
 *                  storagePlacement:
 *                      $ref: '#components/schema/storagePlacement'
 */

/**
 * @swagger
 * components:
 *      schema:
 *          updateStock:
 *              type: object
 *              properties:
 *                  productId:
 *                      type: number
 *                      default:  11
 *                  storagePlacement:
 *                      $ref: '#components/schema/storagePlacement'
 */

/**
 * @swagger
 * components:
 *      schema:
 *          storagePlacement:
 *              type: object
 *              properties:
 *                  row:
 *                      type: number
 *                      default: 1
 *                  index:
 *                      type: number
 *                      default: 1
 *                  area:
 *                      type: number
 *                      default: 1
 *                  quantity:
 *                      type: number
 *                      default: 40
 */


/**
 * @swagger
 * /api/stock/update:
 *  post:
 *      summary: 'update product stock.'
 *      tags: [STOCK]
 *      description: 'Update product stock'
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
*                       $ref: '#components/schema/updateStock'
 *      responses:
 *          '202':
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: object
 */
router.post("/update" , verifyManager, validateUpdateProductPlacementFormat , storageController.updateStockAtStorage)


/**
 * @swagger
 * /api/stock/create:
 *  post:
 *      summary: 'create product stock.'
 *      tags: [STOCK]
 *      description: 'create product stock'
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/createStock'
 *      responses:
 *          '202':
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: object
 */
 router.post("/create", validateCreateProductPlacementFormat, storageController.crateStockAtStorage)

module.exports = router