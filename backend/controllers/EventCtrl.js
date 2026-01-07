const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;
const Evedetails = require("../model/AddEvent");

function convertTo24Hour(time) {
  if (!time || typeof time !== 'string') {
    throw new Error('Invalid time format');
  }
  
  const [timePart, modifier] = time.split(" ");
  if (!timePart || !modifier) {
    throw new Error('Time must be in format "HH:MM AM/PM"');
  }
  
  let [hours, minutes] = timePart.split(":");
  if (!hours || !minutes) {
    throw new Error('Time must be in format "HH:MM AM/PM"');
  }

  if (modifier === "PM" && hours !== "12") {
    hours = String(Number(hours) + 12);
  } else if (modifier === "AM" && hours === "12") {
    hours = "00";
  }

  return `${hours}:${minutes}`;
}


const EventDetails = {
  add: asyncHandler(async (req, res) => {
  try {
    const {eventname,startdate,enddate,venue,description,schedules,eligibility,isTeam,teamSize,hasEntryFee,entryFee,} = req.body;

    if (!eventname || !startdate || !enddate || !schedules) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const parsedSchedules = JSON.parse(schedules).map((s) => ({
      date: new Date(s.date),
      startTime: convertTo24Hour(s.startTime),
      endTime: convertTo24Hour(s.endTime),
    }));

    if (parsedSchedules.length === 0) {
      return res.status(400).json({ message: "At least one schedule required" });
    }

    const parsedEligibility =
      typeof eligibility === "string" ? JSON.parse(eligibility) : eligibility;

let parsedTeamSize = null;

if (isTeam === "true" || isTeam === true) {
  parsedTeamSize =
    typeof teamSize === "string" ? JSON.parse(teamSize) : teamSize;

  if (!parsedTeamSize?.min || !parsedTeamSize?.max) {
    return res.status(400).json({
      message: "Team size min & max required for team events",
    });
  }
}
    if ((hasEntryFee === "true" || hasEntryFee === true) && entryFee <= 0) {
      return res
        .status(400)
        .json({ message: "Entry fee must be greater than 0" });
    }
    if (!req.files?.image?.[0]) {
      return res.status(400).json({ message: "Event image required" });
    }

    const imageFile = req.files.image[0];

    let qrImageData = null;
    if (req.files?.qrImage?.[0]) {
      const qr = req.files.qrImage[0];
      qrImageData = {
        url: qr.path,
        public_id: qr.filename,
      };
    }

    const newEvent = new Evedetails({
      eventname,
      startdate,
      enddate,
      venue,
      description,
      schedules: parsedSchedules,
      eligibility: parsedEligibility,
      isTeam: isTeam === "true" || isTeam === true,
      teamSize: isTeam
        ? { min: teamSize.min, max: teamSize.max }
        : { min: 1, max: 1 },
      hasEntryFee: hasEntryFee === "true" || hasEntryFee === true,
      entryFee: hasEntryFee ? Number(entryFee) : 0,
      image: {
        url: imageFile.path,
        public_id: imageFile.filename,
      },
      qrImage: qrImageData,
    });

    await newEvent.save();

    res.status(201).json({
      message: "Event added successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
  }),

  fetch: asyncHandler(async (req, res) => {
    const storedEvents = await Evedetails.find();
    res.json(storedEvents);
  }),
fetchById: asyncHandler(async (req, res) => {
  const { eventid } = req.params;

  const event = await Evedetails.findById(eventid);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.json(event);
}),

  delete: asyncHandler(async (req, res) => {
    const { eventid } = req.params;
    const delEve = await Evedetails.findById(eventid);
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
    await Evedetails.findByIdAndDelete(eventid);

    res.json({ message: "Event deleted successfully" });
  }),

  update: asyncHandler(async (req, res) => {
  const { eventid } = req.params;
  const existingEvent = await Evedetails.findById(eventid);

  if (!existingEvent) {
    return res.status(404).json({ message: "Event not found" });
  }

  let updates = { ...req.body };

  /* 📅 Update schedules */
  if (updates.schedules) {
    const parsedSchedules = JSON.parse(updates.schedules).map((s) => ({
      date: new Date(s.date),
      startTime: convertTo24Hour(s.startTime),
      endTime: convertTo24Hour(s.endTime),
    }));
    updates.schedules = parsedSchedules;
  }

  /* 🎓 Eligibility */
  if (updates.eligibility) {
    updates.eligibility =
      typeof updates.eligibility === "string"
        ? JSON.parse(updates.eligibility)
        : updates.eligibility;
  }

  /* 👥 Team logic */
  if (updates.isTeam === "false" || updates.isTeam === false) {
    updates.teamSize = { min: 1, max: 1 };
  }

  /* 🖼️ Image update */
  if (req.files?.image?.[0]) {
    if (existingEvent.image?.public_id) {
      await cloudinary.uploader.destroy(existingEvent.image.public_id);
    }
    updates.image = {
      url: req.files.image[0].path,
      public_id: req.files.image[0].filename,
    };
  }

  /* 💳 QR update */
  if (req.files?.qrImage?.[0]) {
    if (existingEvent.qrImage?.public_id) {
      await cloudinary.uploader.destroy(existingEvent.qrImage.public_id);
    }
    updates.qrImage = {
      url: req.files.qrImage[0].path,
      public_id: req.files.qrImage[0].filename,
    };
  }

  const updatedEvent = await Evedetails.findByIdAndUpdate(
    eventid,
    updates,
    { new: true }
  );

  res.json({
    message: "Event updated successfully",
    updatedEvent,
  });
}),
};
module.exports = EventDetails;
