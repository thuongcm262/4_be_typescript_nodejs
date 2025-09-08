import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { errorHandler } from "../error_handles";
import { cancelOrder, changeStatus, createOrder, getOrderById, listAllOrders, listOrders, listUserOrder } from "../controllers/order";
import { adminMiddleware } from "../middlewares/admin";

const orderRouter: Router= Router();

orderRouter.post("/", [authMiddleware], errorHandler(createOrder))
orderRouter.get('/',[authMiddleware], errorHandler(listOrders))
orderRouter.put('/:id/cancel', [authMiddleware], errorHandler(cancelOrder))
orderRouter.get('/index',[authMiddleware, adminMiddleware], errorHandler(listAllOrders))
orderRouter.get('/users/:id',[authMiddleware, adminMiddleware], errorHandler(listUserOrder))
orderRouter.put('/:id/status',[authMiddleware, adminMiddleware], errorHandler(changeStatus))
orderRouter.get('/:id',[authMiddleware], errorHandler(getOrderById))

export default orderRouter;