import { Router } from "express";
import { login, register, getMe } from "../controllers/auth.controllers.js";
import authenticateMiddleware from "../middlewares/authenticate.middleware.js";

const authRoute = Router()

authRoute.post('/register', register)
authRoute.post('/login', login)
authRoute.get('/me', authenticateMiddleware, getMe)

export default authRoute