import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { adminMiddleware } from "../middlewares/admin";
import { errorHandler } from "../error_handles";
import { addAddress, changeUserRole, deleteAddress, getUserById, listAddress, listUsers, updateUser } from "../controllers/users";

const usersRouter:Router = Router();

usersRouter.post("/address", [authMiddleware, adminMiddleware], errorHandler(addAddress))
usersRouter.delete("/address/:id", [authMiddleware, adminMiddleware], errorHandler(deleteAddress))
usersRouter.get("/address", [authMiddleware, adminMiddleware], errorHandler(listAddress))
usersRouter.put('/', [authMiddleware], errorHandler(updateUser))
usersRouter.put('/:id/role', [authMiddleware, adminMiddleware], errorHandler(changeUserRole))
usersRouter.get('/', [authMiddleware, adminMiddleware], errorHandler(listUsers))
usersRouter.get('/:id', [authMiddleware, adminMiddleware], errorHandler(getUserById))
export default usersRouter;