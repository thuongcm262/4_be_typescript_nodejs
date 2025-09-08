import { Router } from "express";
import authRouter from "./auth";
import productsRouter from "./products";
import usersRouter from "./users";
import cartRouter from "./cart";
import orderRouter from "./order";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRouter)
rootRouter.use("/products", productsRouter)
rootRouter.use("/users", usersRouter)
rootRouter.use("/cart", cartRouter)
rootRouter.use("/order", orderRouter)

export default rootRouter;