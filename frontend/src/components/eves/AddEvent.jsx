import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { SiDatabricks } from "react-icons/si";
import { useDispatch } from "react-redux";
import { addeveAction, eventlistApi } from "../../redux/slice/eventSlice";
import { EventAPI } from "../../services/events/eventService";
import AlertMessage from "../Alert/AlertMessage";
import { MdOutlinePeopleOutline, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { BsFillImageFill } from "react-icons/bs";
import { FaRegCalendarAlt } from "react-icons/fa";
import { SlLocationPin } from "react-icons/sl";
import { TbFileDescription } from "react-icons/tb";

const validationSchema = Yup.object({
  eventid: Yup.string().required("Event ID is required"),
  eventname: Yup.string().required("Event name is required"),
  eligibility: Yup.string().required("Eligibility is required"),
  description: Yup.string().required("Description is required"),
  startdate: Yup.string().required("Start date is required"),
  enddate: Yup.string().required("End date is required"),
  venue: Yup.string().required("Venue is required"),
  starttime: Yup.string()
    .matches(/^(0[1-9]|1[0-2]):[0-5][0-9] [APap][mM]$/, "Time must be in 12-hour format (HH:MM AM/PM)")
    .required("Start time is required"),
  endtime: Yup.string()
    .matches(/^(0[1-9]|1[0-2]):[0-5][0-9] [APap][mM]$/, "Time must be in 12-hour format (HH:MM AM/PM)")
    .required("End time is required"),
});

const EventAdder = () => {
  const dispatch = useDispatch();
  const [imagePreview, setImagePreview] = useState(null);

  const mutation = useMutation({
    mutationFn: EventAPI,
    onSuccess: () => {
      dispatch(eventlistApi());
    },
    mutationKey: ["addeve"],
  });

  const formik = useFormik({
    initialValues: {
      eventid: "",
      eventname: "",
      eligibility: "all",
      description: "",
      startdate: "",
      enddate: "",
      venue: "",
      starttime: "",
      endtime: "",
      image: null,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key !== "image") {
          formData.append(key, values[key]);
        }
      });

      if (values.image) {
        formData.append("image", values.image);
      }

      try {
        const data = await mutation.mutateAsync(formData);
        dispatch(addeveAction(data));
        resetForm();
        setImagePreview(null);
      } catch (error) {
        console.error(error);
      }
    },
  });

  // Helper function to generate time options
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 1; hour <= 12; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        times.push(time);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-2xl space-y-8 border border-gray-100"
      >
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Add New Event</h2>
          <p className="mt-2 text-sm text-gray-600">Fill in the details below to create an event.</p>
        </div>

        <div className="space-y-6">
          {/* Event ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              <SiDatabricks className="inline mr-2 text-blue-500" />
              Event ID
            </label>
            <input
              type="text"
              id="eventid"
              name="eventid"
              placeholder="Event ID"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              {...formik.getFieldProps("eventid")}
            />
            {formik.touched.eventid && formik.errors.eventid && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.eventid}</p>
            )}
          </div>

          {/* Event Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              <MdOutlineDriveFileRenameOutline className="inline mr-2 text-blue-500" />
              Event Name
            </label>
            <input
              type="text"
              id="eventname"
              name="eventname"
              placeholder="Event Name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              {...formik.getFieldProps("eventname")}
            />
            {formik.touched.eventname && formik.errors.eventname && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.eventname}</p>
            )}
          </div>

          {/* Eligibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              <MdOutlinePeopleOutline className="inline mr-2 text-blue-500" />
              Eligibility
            </label>
            <select
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              {...formik.getFieldProps("eligibility")}
            >
              <option value="all">All</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          {/* Start Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <FaRegCalendarAlt className="inline mr-2 text-blue-500" />
                Start Date
              </label>
              <input
                type="date"
                id="startdate"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                {...formik.getFieldProps("startdate")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <FaRegCalendarAlt className="inline mr-2 text-blue-500" />
                Start Time
              </label>
              <div className="flex gap-2">
                <select
                  className="mt-1 block w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formik.values.starttime.split(" ")[0]}
                  onChange={(e) => {
                    const time = e.target.value;
                    const ampm = formik.values.starttime.split(" ")[1] || "AM";
                    formik.setFieldValue("starttime", `${time} ${ampm}`);
                  }}
                >
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <select
                  className="mt-1 block w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formik.values.starttime.split(" ")[1] || "AM"}
                  onChange={(e) => {
                    const ampm = e.target.value;
                    const time = formik.values.starttime.split(" ")[0];
                    formik.setFieldValue("starttime", `${time} ${ampm}`);
                  }}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
              {formik.touched.starttime && formik.errors.starttime && (
                <p className="mt-2 text-sm text-red-600">{formik.errors.starttime}</p>
              )}
            </div>
          </div>

          {/* End Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <FaRegCalendarAlt className="inline mr-2 text-blue-500" />
                End Date
              </label>
              <input
                type="date"
                id="enddate"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                {...formik.getFieldProps("enddate")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <FaRegCalendarAlt className="inline mr-2 text-blue-500" />
                End Time
              </label>
              <div className="flex gap-2">
                <select
                  className="mt-1 block w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formik.values.endtime.split(" ")[0]}
                  onChange={(e) => {
                    const time = e.target.value;
                    const ampm = formik.values.endtime.split(" ")[1] || "AM";
                    formik.setFieldValue("endtime", `${time} ${ampm}`);
                  }}
                >
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <select
                  className="mt-1 block w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formik.values.endtime.split(" ")[1] || "AM"}
                  onChange={(e) => {
                    const ampm = e.target.value;
                    const time = formik.values.endtime.split(" ")[0];
                    formik.setFieldValue("endtime", `${time} ${ampm}`);
                  }}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
              {formik.touched.endtime && formik.errors.endtime && (
                <p className="mt-2 text-sm text-red-600">{formik.errors.endtime}</p>
              )}
            </div>
          </div>

          {/* Venue */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              <SlLocationPin className="inline mr-2 text-blue-500" />
              Venue
            </label>
            <input
              type="text"
              id="venue"
              name="venue"
              placeholder="Venue"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              {...formik.getFieldProps("venue")}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              <TbFileDescription className="inline mr-2 text-blue-500" />
              Description
            </label>
            <ReactQuill
              value={formik.values.description}
              onChange={(value) => formik.setFieldValue("description", value)}
              className="bg-white rounded-md"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              <BsFillImageFill className="inline mr-2 text-blue-500" />
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={(event) => {
                const file = event.currentTarget.files[0];
                formik.setFieldValue("image", file);
                setImagePreview(URL.createObjectURL(file));
              }}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 h-32 w-32 object-cover rounded-md"
              />
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Event
          </button>
        </div>

        {/* Loading and Alert Messages */}
        {mutation.isPending && (
          <AlertMessage type="loading" message="Loading, please wait..." />
        )}
        {mutation.isSuccess && (
          <AlertMessage type="success" message="Event added successfully!" />
        )}
        {mutation.isError && (
          <AlertMessage
            type="error"
            message={mutation.error?.response?.data?.message || "Something went wrong"}
          />
        )}
      </form>
    </div>
  );
};

export default EventAdder;

