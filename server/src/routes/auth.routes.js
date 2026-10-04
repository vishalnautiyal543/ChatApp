import {Router} from "express"
import { getMe, login, registerUser } from "../controllers/user.controller.js";
import {upload} from "../middleware/multer.middleware.js"
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post('/register',upload.single("avatar"),registerUser)
router.post('/login',login)
router.get("/me",authMiddleware,getMe);

export default router;