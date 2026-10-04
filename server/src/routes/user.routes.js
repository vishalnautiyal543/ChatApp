import {Router} from "express"
import authMiddleware from "../middleware/auth.middleware.js";
import { searchUsers } from "../controllers/user.controller.js";


const router = Router();


router.get(
  "/search",
  authMiddleware,
  searchUsers
);

export default router;