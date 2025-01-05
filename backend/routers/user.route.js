import express from "express";

import { token } from "../middlewares/token.middleware.js";
import {
	registers,
	accept,
	reject,
	applys,
	refer,
	defer,
	refers,
	approve,
	decline,
	check,
  post,
	posts,
} from "../controllers/user.control.js";

const router = express.Router();

router.get("/registers", registers);
router.post("/registers/:id", accept);
router.delete("/registers/:id", reject);
router.get("/applys", token, applys);
router.post("/applys/:id", token, refer);
router.delete("/applys/:id", defer);
router.get("/refers", refers);
router.post("/refers/:id", approve);
router.delete("/refers/:id", decline);
router.get("/check", token, check);
router.post("/post", token, post);
router.get("/posts", posts);

export default router;
