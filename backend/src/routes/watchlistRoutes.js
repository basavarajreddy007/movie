import express from "express";
import {
  getWatchlist,
  toggleWatchlist,
} from "../controllers/watchlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getWatchlist);
router.post("/toggle", toggleWatchlist);

export default router;