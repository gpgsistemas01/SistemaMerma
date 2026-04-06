import express from 'express';
import { getAllProfiles } from "../../../controllers/api/admin/profileController.js";
import { verifyCookiesAuthTokenRequired } from "../../../middleware/authMiddleware.js";

const router = express.Router();

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    getAllProfiles
);

export default router;