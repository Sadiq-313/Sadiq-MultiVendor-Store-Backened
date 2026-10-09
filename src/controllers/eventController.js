import fs from "fs";
import Event from "../models/eventModel.js";

// 1. Create New Event (For Seller)
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      start_Date,
      Finish_Date,
      originalPrice,
      discountPrice,
      stock,
      sellerId,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Event image is required!" });
    }

    const newEvent = await Event.create({
      title,
      description,
      category,
      start_Date,
      Finish_Date,
      originalPrice,
      discountPrice,
      stock,
      images: req.file.path,
      seller: sellerId,
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully!",
      event: newEvent,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get All Active Events (For Home Page - Popular Event)
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("seller", "shopName name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Delete Event by ID
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event nahi mila!" });
    }

    if (event.images && fs.existsSync(event.images)) {
      fs.unlinkSync(event.images);
    }

    await Event.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully!",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};