import express from "express";
import { createEvent, getAllEvents, deleteEvent } from "../controllers/eventController.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

// Create Event
router.post("/create-event", upload.single("image"), createEvent);

// Get All Events (For Home Page Popular Event)
router.get("/get-all-events", getAllEvents);

// Delete Event
router.delete("/delete-event/:id", deleteEvent);

export default router;