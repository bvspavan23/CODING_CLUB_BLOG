import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import "react-quill/dist/quill.snow.css";
import { SiDatabricks } from "react-icons/si";
import { useDispatch } from "react-redux";
import { addeveAction } from "../../redux/slice/eventSlice";
import { EventAPI } from "../../services/events/eventService";
import AlertMessage from "../Alert/AlertMessage";
import { MdOutlinePeopleOutline } from "react-icons/md";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { SlLocationPin } from "react-icons/sl";
import { useParams } from "react-router-dom";

// Validation schema
const validationSchema = Yup.object({
  Jntuno: Yup.string().required("Jntu number is required"),
  studentname: Yup.string().required("Student Name is required"),
  eligibility: Yup.string().required("Eligibility is required"),
  branch: Yup.string().required("branch is required"),
});

const EventAdder = () => {
  const dispatch = useDispatch();
  const {eventname}=useParams();

  // const mutation = useMutation({
  //   mutationFn: EventAPI,
  //   mutationKey: ["addeve"],
  // });

  // const formik = useFormik({
  //   initialValues: {
  //     Jntuno: "",
  //     studentname: "",
  //     eligibility: "",
  //     branch: "",
  //   },
  //   validationSchema,
  //   onSubmit: (values) => {
  //     mutation
  //       .mutateAsync(values)
  //       .then((data) => {
  //         dispatch(addeveAction(data));
  //       })
  //       .catch((error) => console.error(error));
  //   },
  // });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="max-w-lg mx-auto  bg-white p-6 rounded-lg shadow-lg space-y-6 mt-20"
    >
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Register for {eventname}</h2>
        <p className="text-gray-600">Fill in the details below.</p>
      </div>

      <div className="flex flex-col">
        <label htmlFor="studentname" className="text-gray-700 font-medium">
          <MdOutlineDriveFileRenameOutline className="inline mr-2 text-blue-500" />
          Student Name
        </label>
        <input
          type="text"
          id="studentname"
          name="studentname"
          placeholder="Enter Your Name"
          className="w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 py-2 px-3"
          {...formik.getFieldProps("studentname")}
        />
        {formik.touched.studentname && formik.errors.studentname && (
          <p className="text-sm text-red-600">{formik.errors.studentname}</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="Year"
          className="flex gap-2 items-center text-gray-700 font-medium"
        >
          <MdOutlinePeopleOutline className="text-blue-500" />
          <span>Year</span>
        </label>
        <select
          id="eligibility"
          name="eligibility"
          className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          {...formik.getFieldProps("eligibility")}
        >
          <option value="select">select Your Year</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>
        {formik.touched.eligibility && formik.errors.eligibility && (
          <p className="text-sm text-red-600">{formik.errors.eligibility}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="Jntuno" className="text-gray-700 font-medium">
          <SiDatabricks className="inline mr-2 text-blue-500" />
          Jntu No
        </label>
        <input
          type="text"
          id="Jntuno"
          name="Jntuno"
          placeholder="Jntu No"
          className="w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 py-2 px-3"
          {...formik.getFieldProps("Jntuno")}
        />
        {formik.touched.Jntuno && formik.errors.Jntuno && (
          <p className="text-sm text-red-600">{formik.errors.Jntuno}</p>
        )}
      </div>
      <div className="flex flex-col">
        <label htmlFor="branch" className="text-gray-700 font-medium">
          <SlLocationPin className="inline mr-2 text-blue-500" />
          Branch
        </label>
        <input
          type="text"
          id="branch"
          placeholder="branch"
          className="w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 py-2 px-3"
          {...formik.getFieldProps("branch")}
        />
        {formik.touched.branch && formik.errors.branch && (
          <p className="text-sm text-red-600">{formik.errors.branch}</p>
        )}
      </div>

      <button
        type="submit"
        className="mt-4  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 transform"
      >
        Register
      </button>
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
  );
};

export default EventAdder;
