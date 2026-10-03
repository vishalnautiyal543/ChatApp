import {Router} from "express"
import { login, registerUser } from "../controllers/user.controller.js";
import {upload} from "../middleware/multer.middleware.js"

const router = Router();

router.post('/register',upload.single("avatar"),registerUser)
router.post('/login',login)

export default router;