import { validateInputForUserQuery } from './../middlewares/checkTypeOfRequestBody';
import { verifyAdmin, verifyAll } from '../middlewares/authorization';
import {Router} from 'express';
import { accountController } from '../controllers/accountController';

const router = Router();
/**
 * @swagger
 * components:
 *      schema:
 *          account:
 *              type: object
 *              properties:
 *                  username:
 *                      type: string
 *                  password :
 *                      type: string
 *                  name:
 *                      type: string
 *                  email:
 *                      type: string
 *                  phone:
 *                      type: string
 *          adduser:
 *              type: object
 *              properties:
 *                  username:
 *                      type: string
 *                  password :
 *                      type: string
 *                  name:
 *                      type: string
 *                  email:
 *                      type: string
 *                  phone:
 *                      type: string
 *                  role:
 *                      type: string
 *                  status:
 *                      type: string
 *          login:
 *              type: object
 *              properties:
 *                  username:
 *                      type: string
 *                      default: "manager"
 *                  password :
 *                      type: string
 *          changepassword:
 *              type: object
 *              properties:
 *                  oldpassword:
 *                      type: string
 *                  password:
 *                      type: string
 *          update:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                  email:
 *                      type: string
 *                  phone:
 *                      type: string
 *                  role:
 *                      type: string
 *                  password :
 *                      type: string
 *          status:
 *              type: object
 *              properties:
 *                  status:
 *                      type: string
 */

/**
 * @swagger
 * /api/account/register:
 *  post:
 *      summary: 'Register Account With System Account [PUBLIC]'
 *      tags: [ACCOUNT]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/account'
 *      responses:
 *          '200':
 *              description: 'The server successfully returned the requested data.'
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: object
 *          '400':
 *              description: 'There was an error in the request sent, and the server did not create or modify data.'
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: object
 */
router.post("/register" ,accountController.register) 

/**
 * @swagger
 * /api/account/adduser:
 *  post:
 *      summary: 'Add User Account With System Account [ADMIN]'
 *      tags: [ACCOUNT]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/adduser'
 *      responses:
 *          '200':
 *              description: 'The server successfully returned the requested data.'
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: object
 *          '400':
 *              description: 'There was an error in the request sent, and the server did not create or modify data.'
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: object
 */
 router.post("/adduser", verifyAdmin ,accountController.addUser)

/**
 * @swagger
 * /api/account/login:
 *  post:
 *      summary: 'Login Account With System Account [PUBLIC]'
 *      tags: [ACCOUNT]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/login'
 *      responses:
 *          '200':
 *              description: 'The server successfully returned the requested data.'
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: object
 *          '400':
 *              description: 'There was an error in the request sent, and the server did not create or modify data.'
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: object
 */
 router.post("/login" ,accountController.login)

  /**
 * @swagger
 * /api/account/info:
 *  get:
 *      summary: 'Return User Information With AccessToken [ALL ROLE]'
 *      tags: [ACCOUNT]
 *      responses:
 *          '200':
 *              description: 'The server successfully returned the requested data.'
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: object
 *          '400':
 *              description: 'There was an error in the request sent, and the server did not create or modify data.'
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: object
 */
  router.get("/info", verifyAll, accountController.info)

  /**
 * @swagger
 * /api/account/update/{id}:
 *  put:
 *      summary: 'Change Orther User Information [ADMIN ROLE]'
 *      tags: [ACCOUNT]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/update'
 *      parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: User ID
 *        type: integer
 *      responses:
 *          '200':
 *              description: 'The server successfully returned the requested data.'
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: object
 *          '400':
 *              description: 'There was an error in the request sent, and the server did not create or modify data.'
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: object
 */
  router.put("/update/:id", verifyAdmin, accountController.updateOrtherUser)

/**
 * @swagger
 * /api/account/changepassword/:
 *  put:
 *      summary: 'Change Password User [ALL ROLE]'
 *      tags: [ACCOUNT]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/changepassword'
 *      responses:
 *          '200':
 *              description: 'The server successfully returned the requested data.'
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: object
 *          '400':
 *              description: 'There was an error in the request sent, and the server did not create or modify data.'
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: object
 */
  router.put("/changepassword", verifyAll, accountController.changePassword)

  /**
 * @swagger
 * /api/account/query:
 *  get:
 *      summary: 'query users.'
 *      tags: [ACCOUNT]
 *      description: 'Find users with parameters'
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
router.get("/query", [verifyAdmin, validateInputForUserQuery], accountController.queryUser) 

  /**
 * @swagger
 * /api/account/status/{id}:
 *  put:
 *      summary: 'Change Orther User Information [ADMIN ROLE]'
 *      tags: [ACCOUNT]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schema/status'
 *      parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: User ID
 *        type: integer
 *      responses:
 *          '200':
 *              description: 'The server successfully returned the requested data.'
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: object
 *          '400':
 *              description: 'There was an error in the request sent, and the server did not create or modify data.'
 *              content:
 *                  application/json:
 *                      scheme:
 *                          type: object
 */
  router.put("/status/:id", verifyAdmin, accountController.changeStatus)

module.exports = router; 