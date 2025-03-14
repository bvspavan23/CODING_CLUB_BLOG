import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { updateeveAction, EventList, eventlistApi } from "../../redux/slice/eventSlice";
import AlertMessage from "../Alert/AlertMessage";
import { MdOutlinePeopleOutline, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { BsFillImageFill } from "react-icons/bs";
import { FaRegCalendarAlt } from "react-icons/fa";
import { SlLocationPin } from "react-icons/sl";
import { TbFileDescription } from "react-icons/tb";
import { SiDatabricks } from "react-icons/si";
import { updateEventAPI } from "../../services/events/eventService";

const validationSchema = Yup.object({
  eventid: Yup.string().required("Event ID is required"),
  eventname: Yup.string().required("Event name is required"),
  newEventName: Yup.string().required("New Event name is required"),
  eligibility: Yup.string().required("Eligibility is required"),
  description: Yup.string().required("Description is required"),
  startdate: Yup.string().required("Start date is required"),
  starttime: Yup.string().required("Start time is required"),
  enddate: Yup.string().required("End date is required"),
  endtime: Yup.string().required("End time is required"),
  venue: Yup.string().required("Venue is required"),
});

const EventAdder = () => {
  const dispatch = useDispatch();
  const { eventname } = useParams(); // Get `eventname` from URL params
  const detailsInfo = useSelector(EventList); // Fetch events from Redux store
  const [imagePreview, setImagePreview] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false); // State to track success

  useEffect(() => {
    if (detailsInfo.length === 0) {
      dispatch(eventlistApi()); // Fetch events if not already loaded
    }
  }, [dispatch, detailsInfo.length]);

  const eveDetails = detailsInfo.find((eve) => eve.eventname === String(eventname));

  const mutation = useMutation({
    mutationFn: (formData) => updateEventAPI(eventname, formData), // Pass `eventname` and `formData`
    onSuccess: (data) => {
      // Dispatch the `updateeveAction` with the updated event data
      dispatch(updateeveAction(data));
      setIsSuccess(true); // Set success state to true
    },
    onError: (error) => {
      console.error("Error updating event:", error);
    },
  });

  const formik = useFormik({
    enableReinitialize: true, // Allow reinitialization when `eveDetails` updates
    initialValues: {
      eventid: eveDetails?.eventid || "",
      eventname: eveDetails?.eventname || "",
      newEventName: eveDetails?.eventname || "",
      eligibility: eveDetails?.eligibility || "all",
      description: eveDetails?.description || "",
      startdate: eveDetails?.startdate || "",
      starttime: eveDetails?.starttime || "",
      enddate: eveDetails?.enddate || "",
      endtime: eveDetails?.endtime || "",
      venue: eveDetails?.venue || "",
      image: null,
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key !== "image") {
          formData.append(key, values[key]);
        }
      });

      if (values.image) {
        formData.append("image", values.image);
      }

      console.log("FormData being sent:", formData); // Debugging: Log the formData
      mutation.mutate(formData); // Trigger the mutation
    },
  });

  if (!eveDetails && detailsInfo.length === 0) {
    return <p>Loading event details...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-2xl space-y-8 border border-gray-100"
      >
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Update Event</h2>
          <p className="mt-2 text-sm text-gray-600">Update the details below to modify the event.</p>
        </div>

        {/* Success Message */}
        {isSuccess && (
          <AlertMessage type="success" message="Event updated successfully!" />
        )}

        <div className="space-y-6">
          {/* Event ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              <SiDatabricks className="inline mr-2 text-blue-500" />
              Event ID
            </label>
            <input
              type="text"
              name="eventid"
              id="eventid"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              {...formik.getFieldProps("eventid")}
              disabled // Disable editing of event ID
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
              name="eventname"
              id="eventname"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              {...formik.getFieldProps("eventname")}
              disabled // Disable editing of event name
            />
            {formik.touched.eventname && formik.errors.eventname && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.eventname}</p>
            )}
          </div>

          {/* New Event Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              <MdOutlineDriveFileRenameOutline className="inline mr-2 text-blue-500" />
              New Event Name
            </label>
            <input
              type="text"
              name="newEventName"
              id="newEventName"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              {...formik.getFieldProps("newEventName")}
            />
            {formik.touched.newEventName && formik.errors.newEventName && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.newEventName}</p>
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
            {formik.touched.eligibility && formik.errors.eligibility && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.eligibility}</p>
            )}
          </div>

          {/* Start & End Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <FaRegCalendarAlt className="inline mr-2 text-blue-500" />
                Start Date
              </label>
              <input
                type="date"
                name="startdate"
                id="startdate"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                {...formik.getFieldProps("startdate")}
              />
              {formik.touched.startdate && formik.errors.startdate && (
                <p className="mt-2 text-sm text-red-600">{formik.errors.startdate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <FaRegCalendarAlt className="inline mr-2 text-blue-500" />
                Start Time
              </label>
              <input
                type="time"
                name="starttime"
                id="starttime"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                {...formik.getFieldProps("starttime")}
              />
              {formik.touched.starttime && formik.errors.starttime && (
                <p className="mt-2 text-sm text-red-600">{formik.errors.starttime}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <FaRegCalendarAlt className="inline mr-2 text-blue-500" />
                End Date
              </label>
              <input
                type="date"
                name="enddate"
                id="enddate"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                {...formik.getFieldProps("enddate")}
              />
              {formik.touched.enddate && formik.errors.enddate && (
                <p className="mt-2 text-sm text-red-600">{formik.errors.enddate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <FaRegCalendarAlt className="inline mr-2 text-blue-500" />
                End Time
              </label>
              <input
                type="time"
                name="endtime"
                id="endtime"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                {...formik.getFieldProps("endtime")}
              />
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
              name="venue"
              id="venue"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              {...formik.getFieldProps("venue")}
            />
            {formik.touched.venue && formik.errors.venue && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.venue}</p>
            )}
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
            {formik.touched.description && formik.errors.description && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.description}</p>
            )}
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
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Updating..." : "Update Event"}
          </button>
        </div>

        {/* Loading and Error Messages */}
        {mutation.isLoading && (
          <AlertMessage type="loading" message="Loading, please wait..." />
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