import {Router} from 'express'
import { addItemToCart, changeQuantity, deleteItemFromCart, getCart } from '../controllers/cart'
import { authMiddleware } from '../middlewares/auth'
import { errorHandler } from '../error_handles'

const cartRouter:Router = Router()

cartRouter.post('/',[authMiddleware], errorHandler(addItemToCart))
cartRouter.get('/',[authMiddleware], errorHandler(getCart))
cartRouter.delete('/:id',[authMiddleware], errorHandler(deleteItemFromCart))
cartRouter.put('/:id', [authMiddleware], errorHandler(changeQuantity))


export default cartRouter