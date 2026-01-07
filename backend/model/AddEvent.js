const mongoose = require("mongoose");
const ScheduleSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String, 
      required: true,
    },
  },
  { _id: false }
);

const EventSchema = new mongoose.Schema(
  {
    eventname: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
    },

    venue: {
      type: String,
    },
    startdate: {
      type: Date,
      required: true,
    },
    enddate: {
      type: Date,
      required: true,
    },
    schedules: {
      type: [ScheduleSchema],
      required: true,
    },
    eligibility: {
      year: {
        type: [String], 
        required: true,
      },
      branch: {
        type: [String],
        required: true,
      },
    },
    image: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },

    isTeam: {
      type: Boolean,
      default: false,
    },
    teamSize: {
      min: {
        type: Number,
        default: 1,
      },
      max: {
        type: Number,
        default: 1,
      },
    },
    hasEntryFee: {
      type: Boolean,
      default: false,
    },
    entryFee: {
      type: Number,
      default: 0,
    },

    qrImage: {
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

EventSchema.pre("save", function (next) {
  if (this.hasEntryFee && this.entryFee <= 0) {
    return next(new Error("Entry fee must be greater than 0 for paid events"));
  }

  if (this.isTeam) {
    if (
      !this.teamSize ||
      this.teamSize.min < 1 ||
      this.teamSize.max < this.teamSize.min
    ) {
      return next(new Error("Invalid team size configuration"));
    }
  }

  if (!this.schedules || this.schedules.length === 0) {
    return next(new Error("At least one schedule is required"));
  }

  next();
});

module.exports = mongoose.model("EveDetails", EventSchema);
