import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  updateeveAction,
  EventList,
  eventlistApi,
} from "../../redux/slice/eventSlice";
import AlertMessage from "../Alert/AlertMessage";
import { updateEventAPI } from "../../services/events/eventService";
import { MdOutlinePermMedia } from "react-icons/md";
import { GrContactInfo } from "react-icons/gr";
import {
  FaRegCalendarAlt,
  FaUsers,
  FaMoneyBillWave,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaCalendarPlus,
  FaGraduationCap,
} from "react-icons/fa";

// Add schedule item type
const initialSchedule = {
  date: "",
  startTime: "09:00 AM",
  endTime: "05:00 PM",
};

// Add this helper function near the top of the component
function convertTo24Hour(time) {
  if (!time || typeof time !== "string") {
    throw new Error("Invalid time format");
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

// Eligibility options
const yearOptions = ["1", "2", "3", "4"];
const branchOptions = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"];

const validationSchema = Yup.object({
  eventname: Yup.string().required("Event name is required"),
  description: Yup.string(),
  venue: Yup.string(),
  startdate: Yup.date().required("Start date is required"),
  enddate: Yup.date().required("End date is required"),
  schedules: Yup.array()
    .of(
      Yup.object({
        date: Yup.date().required("Schedule date is required"),
        startTime: Yup.string()
          .matches(
            /^(0[1-9]|1[0-2]):[0-5][0-9] [APap][mM]$/,
            "Time must be in 12-hour format (HH:MM AM/PM)"
          )
          .required("Start time is required"),
        endTime: Yup.string()
          .matches(
            /^(0[1-9]|1[0-2]):[0-5][0-9] [APap][mM]$/,
            "Time must be in 12-hour format (HH:MM AM/PM)"
          )
          .required("End time is required"),
      })
    )
    .min(1, "At least one schedule is required"),

  eligibility: Yup.object({
    year: Yup.array()
      .min(1, "Select at least one year")
      .required("Year eligibility is required"),
    branch: Yup.array()
      .min(1, "Select at least one branch")
      .required("Branch eligibility is required"),
  }),

  image: Yup.mixed().nullable(),
  isTeam: Yup.boolean(),
  teamSize: Yup.object().when("isTeam", {
    is: true,
    then: () =>
      Yup.object({
        min: Yup.number()
          .min(1, "Minimum must be at least 1")
          .required("Min team size is required"),
        max: Yup.number()
          .min(1, "Maximum must be at least 1")
          .test(
            "max-gte-min",
            "Maximum must be greater than or equal to minimum",
            function (value) {
              const { min } = this.parent;
              return value >= min;
            }
          )
          .required("Max team size is required"),
      }),
    otherwise: () =>
      Yup.object({
        min: Yup.number(),
        max: Yup.number(),
      }),
  }),

  hasEntryFee: Yup.boolean(),
  entryFee: Yup.number().when("hasEntryFee", {
    is: true,
    then: () =>
      Yup.number()
        .min(0.01, "Entry fee must be greater than 0")
        .required("Entry fee is required"),
    otherwise: () => Yup.number(),
  }),

  qrImage: Yup.mixed().nullable(),
});

const EventEdit = () => {
  const dispatch = useDispatch();
  const { eventid } = useParams(); // Get eventid from URL params
  const detailsInfo = useSelector(EventList);
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);
  const [schedules, setSchedules] = useState([{ ...initialSchedule }]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (detailsInfo.length === 0) {
      dispatch(eventlistApi());
    }
  }, [dispatch, detailsInfo.length]);

  // Find the event by eventid
  const eveDetails = detailsInfo.find((eve) => eve._id === eventid);

  useEffect(() => {
    if (eveDetails) {
      // Initialize schedules
      if (eveDetails.schedules && eveDetails.schedules.length > 0) {
        setSchedules(
          eveDetails.schedules.map((s) => ({
            date: s.date.split("T")[0], // Format date for input
            startTime: s.startTime,
            endTime: s.endTime,
          }))
        );
      }

      // Initialize eligibility
      if (eveDetails.eligibility) {
        setSelectedYears(eveDetails.eligibility.year || []);
        setSelectedBranches(eveDetails.eligibility.branch || []);
      }

      // Initialize image preview
      if (eveDetails.image?.url) {
        setImagePreview(eveDetails.image.url);
      }

      // Initialize QR preview
      if (eveDetails.qrImage?.url) {
        setQrPreview(eveDetails.qrImage.url);
      }
    }
  }, [eveDetails]);

  const mutation = useMutation({
    mutationFn: (formData) => updateEventAPI(eventid, formData),
    onSuccess: (data) => {
      dispatch(updateeveAction(data));
      setIsSuccess(true);
      // Reset success message after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    },
    onError: (error) => {
      console.error("Error updating event:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
    },
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      eventname: eveDetails?.eventname || "",
      description: eveDetails?.description || "",
      venue: eveDetails?.venue || "",
      startdate: eveDetails?.startdate
        ? eveDetails.startdate.split("T")[0]
        : "",
      enddate: eveDetails?.enddate ? eveDetails.enddate.split("T")[0] : "",
      schedules: [],
      eligibility: {
        year: [],
        branch: [],
      },
      image: null,
      qrImage: null,
      isTeam: eveDetails?.isTeam || false,
      teamSize: eveDetails?.teamSize || { min: 1, max: 1 },
      hasEntryFee: eveDetails?.hasEntryFee || false,
      entryFee: eveDetails?.entryFee || 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Prepare the schedules data - convert times to 24-hour format
        const formattedSchedules = schedules.map((schedule) => ({
          date: schedule.date,
          startTime: convertTo24Hour(schedule.startTime),
          endTime: convertTo24Hour(schedule.endTime),
        }));

        // Create FormData for file uploads
        const formData = new FormData();

        // Append all fields as strings
        formData.append("eventname", values.eventname);
        formData.append("description", values.description || "");
        formData.append("venue", values.venue || "");
        formData.append("startdate", values.startdate);
        formData.append("enddate", values.enddate);
        formData.append("schedules", JSON.stringify(formattedSchedules));
        formData.append(
          "eligibility",
          JSON.stringify({
            year: selectedYears,
            branch: selectedBranches,
          })
        );
        formData.append("isTeam", values.isTeam.toString());

        if (values.isTeam) {
          formData.append("teamSize", JSON.stringify(values.teamSize));
        } else {
          formData.append("teamSize", JSON.stringify({ min: 1, max: 1 }));
        }

        formData.append("hasEntryFee", values.hasEntryFee.toString());

        if (values.hasEntryFee) {
          formData.append("entryFee", values.entryFee.toString());
        } else {
          formData.append("entryFee", "0");
        }

        // Append files only if they were changed
        if (values.image && values.image instanceof File) {
          formData.append("image", values.image);
        }

        if (values.qrImage && values.qrImage instanceof File) {
          formData.append("qrImage", values.qrImage);
        }

        console.log("Submitting update form data...");

        // Log FormData for debugging
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }

        mutation.mutate(formData);
      } catch (error) {
        console.error("Error preparing form data:", error);
        alert(`Error: ${error.message}`);
      }
    },
  });

  // Update formik values when schedules change
  useEffect(() => {
    formik.setFieldValue("schedules", schedules);
  }, [schedules]);

  // Update eligibility in formik
  useEffect(() => {
    formik.setFieldValue("eligibility.year", selectedYears);
  }, [selectedYears]);

  useEffect(() => {
    formik.setFieldValue("eligibility.branch", selectedBranches);
  }, [selectedBranches]);

  // Schedule management
  const addSchedule = () => {
    setSchedules([...schedules, { ...initialSchedule }]);
  };

  const removeSchedule = (index) => {
    if (schedules.length > 1) {
      const newSchedules = [...schedules];
      newSchedules.splice(index, 1);
      setSchedules(newSchedules);
    }
  };

  const updateSchedule = (index, field, value) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value;
    setSchedules(newSchedules);
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 1; hour <= 12; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        times.push(time);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formik.values.eventname && !formik.errors.eventname;
      case 2:
        return (
          formik.values.startdate &&
          formik.values.enddate &&
          !formik.errors.startdate &&
          !formik.errors.enddate
        );
      case 3:
        return (
          schedules.every((s) => s.date && s.startTime && s.endTime) &&
          schedules.length > 0
        );
      case 4:
        return selectedYears.length > 0 && selectedBranches.length > 0;
      case 5:
        // Settings validation
        if (formik.values.isTeam) {
          if (!formik.values.teamSize?.min || formik.values.teamSize.min < 1)
            return false;
          if (
            !formik.values.teamSize?.max ||
            formik.values.teamSize.max < formik.values.teamSize.min
          )
            return false;
        }
        if (formik.values.hasEntryFee) {
          if (!formik.values.entryFee || formik.values.entryFee <= 0)
            return false;
        }
        return true;
      case 6:
        // Media validation - image is optional for update
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
    } else {
      formik.validateForm();
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const steps = [
    { number: 1, title: "Basic Info", icon: GrContactInfo },
    { number: 2, title: "Event Dates", icon: FaRegCalendarAlt },
    { number: 3, title: "Schedules", icon: FaCalendarPlus },
    { number: 4, title: "Eligibility", icon: FaGraduationCap },
    { number: 5, title: "Settings", icon: FaUsers },
    { number: 6, title: "Media", icon: MdOutlinePermMedia },
  ];

  const StepIndicator = ({ step, currentStep, title, icon: Icon }) => (
    <div className="flex flex-col items-center flex-1 relative">
      <div className="flex flex-col items-center">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
            currentStep >= step
              ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg"
              : "bg-white text-gray-400 border-2 border-gray-300"
          } ${currentStep === step ? "ring-4 ring-blue-200" : ""}`}
        >
          {currentStep > step ? (
            <FaCheck className="w-5 h-5" />
          ) : (
            <Icon className="w-5 h-5" />
          )}
        </div>
        <span className="mt-2 text-xs font-semibold text-gray-700">
          {title}
        </span>
      </div>
    </div>
  );

  const handleYearToggle = (year) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  const handleBranchToggle = (branch) => {
    setSelectedBranches((prev) =>
      prev.includes(branch)
        ? prev.filter((b) => b !== branch)
        : [...prev, branch]
    );
  };

  if (!eveDetails && detailsInfo.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading event details...</p>
      </div>
    );
  }

  if (!eveDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-600">Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Update Event: {eveDetails.eventname}
          </h1>
          <p className="text-gray-600">Update the details for your event</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative px-8">
            <div className="absolute top-6 left-20 right-20 h-1 bg-gray-200 -z-10">
              <div
                className="h-full bg-blue-500 transition-all duration-700 ease-out"
                style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
              />
            </div>
            {steps.map((step) => (
              <StepIndicator
                key={step.number}
                step={step.number}
                currentStep={currentStep}
                title={step.title}
                icon={step.icon}
              />
            ))}
          </div>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Basic Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Annual Tech Conference"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      {...formik.getFieldProps("eventname")}
                    />
                    {formik.touched.eventname && formik.errors.eventname && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.eventname}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Describe your event..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      {...formik.getFieldProps("description")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Venue
                    </label>
                    <input
                      type="text"
                      placeholder="Convention Center"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      {...formik.getFieldProps("venue")}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Event Dates */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Event Dates
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      {...formik.getFieldProps("startdate")}
                    />
                    {formik.touched.startdate && formik.errors.startdate && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.startdate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      {...formik.getFieldProps("enddate")}
                    />
                    {formik.touched.enddate && formik.errors.enddate && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.enddate}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Schedules */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Event Schedules
                  </h2>
                  <button
                    type="button"
                    onClick={addSchedule}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Add Schedule
                  </button>
                </div>

                <div className="space-y-4">
                  {schedules.map((schedule, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Schedule {index + 1}</h3>
                        {schedules.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSchedule(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date *
                          </label>
                          <input
                            type="date"
                            value={schedule.date}
                            onChange={(e) =>
                              updateSchedule(index, "date", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Time *
                          </label>
                          <div className="flex gap-2">
                            <select
                              value={schedule.startTime.split(" ")[0]}
                              onChange={(e) => {
                                const time = e.target.value;
                                const ampm =
                                  schedule.startTime.split(" ")[1] || "AM";
                                updateSchedule(
                                  index,
                                  "startTime",
                                  `${time} ${ampm}`
                                );
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                            >
                              {timeOptions.map((time) => (
                                <option key={time} value={time}>
                                  {time}
                                </option>
                              ))}
                            </select>
                            <select
                              value={schedule.startTime.split(" ")[1] || "AM"}
                              onChange={(e) => {
                                const ampm = e.target.value;
                                const time = schedule.startTime.split(" ")[0];
                                updateSchedule(
                                  index,
                                  "startTime",
                                  `${time} ${ampm}`
                                );
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                            >
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Time *
                          </label>
                          <div className="flex gap-2">
                            <select
                              value={schedule.endTime.split(" ")[0]}
                              onChange={(e) => {
                                const time = e.target.value;
                                const ampm =
                                  schedule.endTime.split(" ")[1] || "AM";
                                updateSchedule(
                                  index,
                                  "endTime",
                                  `${time} ${ampm}`
                                );
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                            >
                              {timeOptions.map((time) => (
                                <option key={time} value={time}>
                                  {time}
                                </option>
                              ))}
                            </select>
                            <select
                              value={schedule.endTime.split(" ")[1] || "AM"}
                              onChange={(e) => {
                                const ampm = e.target.value;
                                const time = schedule.endTime.split(" ")[0];
                                updateSchedule(
                                  index,
                                  "endTime",
                                  `${time} ${ampm}`
                                );
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                            >
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Eligibility */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <h2 className="text-xl font-semibold text-gray-800">
                  Eligibility Criteria
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-3">
                      Eligible Years *
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {yearOptions.map((year) => (
                        <button
                          key={year}
                          type="button"
                          onClick={() => handleYearToggle(year)}
                          className={`px-4 py-2 rounded-lg border transition ${
                            selectedYears.includes(year)
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                          }`}
                        >
                          Year {year}
                        </button>
                      ))}
                    </div>
                    {formik.touched.eligibility?.year &&
                      formik.errors.eligibility?.year && (
                        <p className="mt-2 text-sm text-red-600">
                          {formik.errors.eligibility.year}
                        </p>
                      )}
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-3">
                      Eligible Branches *
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {branchOptions.map((branch) => (
                        <button
                          key={branch}
                          type="button"
                          onClick={() => handleBranchToggle(branch)}
                          className={`px-4 py-2 rounded-lg border transition ${
                            selectedBranches.includes(branch)
                              ? "bg-green-500 text-white border-green-500"
                              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                          }`}
                        >
                          {branch}
                        </button>
                      ))}
                    </div>
                    {formik.touched.eligibility?.branch &&
                      formik.errors.eligibility?.branch && (
                        <p className="mt-2 text-sm text-red-600">
                          {formik.errors.eligibility.branch}
                        </p>
                      )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Settings */}
            {currentStep === 5 && (
              <div className="space-y-8">
                <h2 className="text-xl font-semibold text-gray-800">
                  Event Settings
                </h2>

                <div className="space-y-6">
                  {/* Team Settings */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">
                          Team Event
                        </h3>
                        <p className="text-sm text-gray-600">
                          Enable if participants will compete in teams
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={formik.values.isTeam}
                          onChange={(e) => {
                            formik.setFieldValue("isTeam", e.target.checked);
                            if (!e.target.checked) {
                              formik.setFieldValue("teamSize", {
                                min: 1,
                                max: 1,
                              });
                            }
                          }}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {formik.values.isTeam && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Minimum Team Size *
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={formik.values.teamSize.min}
                            onChange={(e) => {
                              const newMin = parseInt(e.target.value) || 1;
                              formik.setFieldValue("teamSize", {
                                min: newMin,
                                max: Math.max(
                                  newMin,
                                  formik.values.teamSize.max
                                ),
                              });
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Maximum Team Size *
                          </label>
                          <input
                            type="number"
                            min={formik.values.teamSize.min}
                            value={formik.values.teamSize.max}
                            onChange={(e) =>
                              formik.setFieldValue(
                                "teamSize.max",
                                parseInt(e.target.value) ||
                                  formik.values.teamSize.min
                              )
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Entry Fee Settings */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">
                          Entry Fee
                        </h3>
                        <p className="text-sm text-gray-600">
                          Enable if participants need to pay to join
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={formik.values.hasEntryFee}
                          onChange={(e) => {
                            formik.setFieldValue(
                              "hasEntryFee",
                              e.target.checked
                            );
                            if (!e.target.checked) {
                              formik.setFieldValue("entryFee", 0);
                            }
                          }}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    {formik.values.hasEntryFee && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Entry Fee Amount *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            ₹
                          </span>
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="0.00"
                            value={formik.values.entryFee}
                            onChange={(e) =>
                              formik.setFieldValue(
                                "entryFee",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Media */}
            {currentStep === 6 && (
              <div className="space-y-8">
                <h2 className="text-xl font-semibold text-gray-800">
                  Event Media
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Event Image (Optional - Leave empty to keep current)
                    </label>
                    <div className="mt-2">
                      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                        {imagePreview ? (
                          <div className="relative w-full h-full">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                formik.setFieldValue("image", null);
                                setImagePreview(eveDetails.image?.url || null);
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8">
                            <MdOutlinePermMedia className="w-12 h-12 text-gray-400 mb-4" />
                            <p className="text-gray-600">
                              <span className="font-semibold">
                                Click to upload new image
                              </span>
                            </p>
                            <p className="text-sm text-gray-500">
                              PNG, JPG, JPEG
                            </p>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              formik.setFieldValue("image", file);
                              setImagePreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </label>
                    </div>
                    {formik.touched.image && formik.errors.image && (
                      <p className="mt-2 text-sm text-red-600">
                        {formik.errors.image}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      QR Code Image (Optional - Leave empty to keep current)
                    </label>
                    <div className="mt-2">
                      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500">
                        {qrPreview ? (
                          <div className="relative w-full h-full">
                            <img
                              src={qrPreview}
                              alt="QR Preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                formik.setFieldValue("qrImage", null);
                                setQrPreview(eveDetails.qrImage?.url || null);
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-6">
                            <div className="w-10 h-10 border-2 border-gray-400 rounded flex items-center justify-center mb-2">
                              QR
                            </div>
                            <p className="text-gray-600">
                              <span className="font-semibold">
                                Click to upload new QR code
                              </span>
                            </p>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              formik.setFieldValue("qrImage", file);
                              setQrPreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Back
              </button>
            )}

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Continue
              </button>
            ) : (
              <div className="ml-auto flex gap-3">
                <button
                  type="submit"
                  disabled={mutation.isLoading}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                >
                  {mutation.isLoading ? "Updating..." : "Update Event"}
                </button>
              </div>
            )}
          </div>

          {/* Alert Messages */}
          {isSuccess && (
            <div className="mt-4">
              <AlertMessage
                type="success"
                message="Event updated successfully!"
              />
            </div>
          )}
          {mutation.isLoading && (
            <div className="mt-4">
              <AlertMessage
                type="loading"
                message="Updating event, please wait..."
              />
            </div>
          )}
          {mutation.isError && (
            <div className="mt-4">
              <AlertMessage
                type="error"
                message={
                  mutation.error?.response?.data?.message ||
                  mutation.error?.message ||
                  "Something went wrong while updating"
                }
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EventEdit;
