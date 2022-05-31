import { verifyAll } from './../middlewares/authorization';
import { productController } from '../controllers/productController';
import {Router} from 'express';
import { validateInputForProductQuery, validateProductFormat } from '../middlewares/checkTypeOfRequestBody';
const router = Router();
/**
 * @swagger
 * components:
 *      schema:
 *          product:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                  categoryId:
 *                      type: number
 *                      default: 1
 *                  image:
 *                      type: array
 *                      items:
 *                        type: string
 *                  price:
 *                      type: number
 *                      default: 100
 *                  author:
 *                      type: string
 *                      default: "Steven King"
 *                  description:
 *                      type: string
 *                      default: "This is a horror book"
 *          updateProduct:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                  categoryId:
 *                      type: number
 *                      default: 1
 *                  image:
 *                      type: array
 *                      items:
 *                        type: string
 *                  price:
 *                      type: number
 *                      default: 100
 *                  author:
 *                      type: string
 *                      default: "Steven King"
 *                  description:
 *                      type: string
 *                      default: "This is a horror book"
 *                  isAvailable:
 *                      type: boolean
 *                      default: true
 */

/**
 * @swagger
 * /api/product/:
 *  get:
 *      summary: 'get product list'
 *      tags: [PRODUCT]
 *      description: 'Return an array of Product object'
 *      responses:
 *          '202':
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: array
 * 
 */
router.get("/", productController.getAllProducts)

 /**
 * @swagger
 * /api/product/{id}:
 *  get:
 *      summary: 'find a product.'
 *      tags: [PRODUCT]
 *      description: 'Find one product from id'
 *      parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The Product ID
 *        type: integer
 *      responses:
 *          '202':
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: object
 */
router.get("/:id*", productController.findOneProduct)

/**
 * @swagger
 * /api/product/:
 *  post:
 *      summary: 'add a product.'
 *      tags: [PRODUCT]
 *      description: 'Add 1 Product'
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/product'
 *      responses:
 *          '202':
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: array
 */
router.post("/", verifyAll, validateProductFormat, productController.addProduct)

/**
 * @swagger
 * /api/product/{id}:
 *  put:
 *      summary: 'update a product.'
 *      tags: [PRODUCT]
 *      description: 'Update 1 Product'
 *      parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The Product ID
 *        type: integer
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/updateProduct'
 *      responses:
 *          '202':
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: array
 */
router.put("/:id", verifyAll, validateProductFormat, productController.updateProduct)


 /**
 * @swagger
 * /api/product/{id}:
 *  delete:
 *      summary: 'delete a product.'
 *      tags: [PRODUCT]
 *      description: 'Delete one product with id'
 *      parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The Product ID
 *        type: integer
 *      responses:
 *          '202':
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: object
 */
router.delete("/:id", verifyAll, productController.deleteProduct)

  /**
 * @swagger
 * /api/product/query:
 *  post:
 *      summary: 'query products.'
 *      tags: [PRODUCT]
 *      description: 'Find products with parameters'
 *      parameters:
 *      - in: query
 *        name: pageIndex
 *        required: false
 *        description: Page Index
 *        type: integer
 *      - in: query
 *        name: pageLimit
 *        required: false
 *        description: Page Limit
 *        type: integer
 *      - in: query
 *        name: sortBy
 *        required: false
 *        description: Sort By
 *        type: string
 *      - in: query
 *        name: sortOrder
 *        required: false
 *        description: Sort Order
 *        type: string
 *        default: "descending"
 *      - in: query
 *        name: searchInput
 *        required: false
 *        description: Search Input
 *        type: string
 *        default: ""
 *      responses:
 *          '202':
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: object
 */
router.post("/query", validateInputForProductQuery, productController.queryProduct)

module.exports = router