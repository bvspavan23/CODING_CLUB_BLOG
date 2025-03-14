const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;
const Evedetails = require("../model/AddEvent");

function convertTo24Hour(time) {
  const [timePart, modifier] = time.split(" ");
  let [hours, minutes] = timePart.split(":");

  if (modifier === "PM" && hours !== "12") {
    hours = String(Number(hours) + 12);
  } else if (modifier === "AM" && hours === "12") {
    hours = "00";
  }

  return `${hours}:${minutes}`;
}

// const startTime24 = convertTo24Hour(starttime);
// const endTime24 = convertTo24Hour(endtime);

const EventDetails = {
  add: asyncHandler(async (req, res) => {
    try {
      const {
        eventname,
        eventid,
        startdate,
        starttime,
        enddate,
        endtime,
        venue,
        description,
        eligibility,
      } = req.body;

      if (!starttime || !endtime) {
        return res
          .status(400)
          .json({ message: "Start time and End time are required" });
      }
      if (!req.file || !req.file.path) {
        return res.status(400).json({ message: "Image file is required" });
      }

      // Convert time format
      const starttime24 = convertTo24Hour(starttime);
      const endtime24 = convertTo24Hour(endtime);

      // Cloudinary Upload Result
      const imageUrl = req.file.path || req.file.url;
      const publicId = req.file.filename || req.file.public_id;

      // Create new event
      const newEvent = new Evedetails({
        eventname,
        eventid,
        startdate,
        starttime: starttime24,
        enddate,
        endtime: endtime24,
        venue,
        description,
        eligibility,
        image: {
          url: imageUrl,
          public_id: publicId,
        },
      });

      await newEvent.save();

      res
        .status(201)
        .json({ message: "Event added successfully", event: newEvent });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }),

  fetch: asyncHandler(async (req, res) => {
    const storedEvents = await Evedetails.find();
    res.json(storedEvents);
  }),

  delete: asyncHandler(async (req, res) => {
    const { eventid } = req.params;

    // Find the event in the database
    const delEve = await Evedetails.findOne({ eventid });
    console.log("Event to be deleted:", delEve);

    if (!delEve) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Delete the image from Cloudinary if it exists
    if (delEve.image && delEve.image.public_id) {
      try {
        await cloudinary.uploader.destroy(delEve.image.public_id);
        console.log("Image deleted from Cloudinary");
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
      }
    }

    // Delete the event from the database
    await Evedetails.findByIdAndDelete(delEve._id);

    res.json({ message: "Event deleted successfully" });
  }),

  update: asyncHandler(async (req, res) => {
    let { eventname } = req.params;
    eventname = decodeURIComponent(eventname).trim();

    console.log("Received update request for event:", eventname);

    // Parse data depending on request type
    let requestBody;
    if (req.is("application/json")) {
      requestBody = req.body;
    } else if (req.is("multipart/form-data")) {
      requestBody = req.body;
    } else {
      return res.status(400).json({ message: "Invalid request format" });
    }

    console.log("Request body:", requestBody);

    const {
      newEventName,
      eligibility,
      description,
      startdate,
      starttime,
      enddate,
      endtime,
      venue,
    } = requestBody;

    const existingEvent = await Evedetails.findOne({ eventname });
    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (newEventName && newEventName !== eventname) {
      const nameExists = await Evedetails.findOne({ eventname: newEventName });
      if (nameExists) {
        return res.status(400).json({ message: "Event name already exists" });
      }
    }

    let updatedImage = existingEvent.image;
    if (req.file && req.file.path) {
      try {
        // Delete old image from Cloudinary
        if (existingEvent.image && existingEvent.image.public_id) {
          await cloudinary.uploader.destroy(existingEvent.image.public_id);
        }

        // Save new image details
        updatedImage = {
          url: req.file.path || req.file.url,
          public_id: req.file.filename || req.file.public_id,
        };
      } catch (error) {
        console.error("Error updating image:", error);
        return res
          .status(500)
          .json({ message: "Failed to update event image" });
      }
    }

    // Update event details
    const updateEvent = await Evedetails.findByIdAndUpdate(
      existingEvent._id,
      {
        eventname: newEventName || existingEvent.eventname,
        eligibility: eligibility || existingEvent.eligibility,
        description: description || existingEvent.description,
        startdate: startdate || existingEvent.startdate,
        starttime: starttime || existingEvent.starttime,
        enddate: enddate || existingEvent.enddate,
        endtime: endtime || existingEvent.endtime,
        venue: venue || existingEvent.venue,
        image: updatedImage,
      },
      { new: true }
    );

    if (!updateEvent) {
      return res.status(500).json({ message: "Failed to update event" });
    }

    res.json({
      message: "Event updated successfully",
      updatedEvent: updateEvent,
    });
  }),
};
module.exports = EventDetails;
