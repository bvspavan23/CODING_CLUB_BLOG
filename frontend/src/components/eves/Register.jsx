import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import "react-quill/dist/quill.snow.css";
import { useDispatch } from "react-redux";
import { registerAction } from "../../redux/slice/everegSlice";
import { registerEventAPI } from "../../services/events/eventService";
import AlertMessage from "../Alert/AlertMessage";
import { MdOutlinePeopleOutline } from "react-icons/md";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { SlLocationPin } from "react-icons/sl";
import { CiMobile3 } from "react-icons/ci";
import { MdAlternateEmail } from "react-icons/md";
import { FaRegIdCard } from "react-icons/fa6";
import { BsFillCreditCard2BackFill } from "react-icons/bs";


// Dynamic validation schema based on event type
const createValidationSchema = (isTeam, teamSize) => {
  const baseSchema = {
    jntuno: Yup.string().required("Jntu number is required"),
    studentname: Yup.string().required("Student Name is required"),
    studentemail: Yup.string().email("Invalid email").required("Email is required"),
    studentmobile: Yup.string().required("Mobile number is required"),
    studentyear: Yup.string().required("studentyear is required"),
    branch: Yup.string().required("branch is required"),
    payment: Yup.boolean(),
  };

  if (isTeam) {
    baseSchema.team = Yup.array()
      .of(
        Yup.object().shape({
          studentname: Yup.string().required("Team member name is required"),
          studentemail: Yup.string().email("Invalid email").required("Team member email is required"),
          jntuno: Yup.string().required("Team member JNTU number is required"),
          studentmobile: Yup.string().required("Team member mobile is required"),
          studentyear: Yup.string().required("Team member year is required"),
          branch: Yup.string().required("Team member branch is required"),
        })
      )
      .min(teamSize, `Exactly ${teamSize} team members are required`)
      .max(teamSize, `Exactly ${teamSize} team members are required`);
  }

  return Yup.object(baseSchema);
};

const Registerator= () => {
  const dispatch = useDispatch();
  const {eventid, eventname} =useParams();
  const [eventDetails, setEventDetails] = useState(null);
  
  console.log("name from url:", eventname);
  console.log("id from url:", eventid);

  // Fetch event details
  const { data: eventData, isLoading: eventLoading } = useQuery({
    queryKey: ['eventDetails', eventid],
    queryFn: async () => {
      const response = await fetch(`/api/events/details/${eventid}`);
      if (!response.ok) throw new Error('Failed to fetch event details');
      return response.json();
    },
    enabled: !!eventid,
  });

  useEffect(() => {
    if (eventData) {
      setEventDetails(eventData);
    }
  }, [eventData]);

  const mutation = useMutation({
    mutationFn: registerEventAPI,
    mutationKey: ["register"],
  });

  // Initialize team members array based on event details
  const initializeTeamMembers = (teamSize) => {
    return Array.from({ length: teamSize }, () => ({
      studentname: "",
      studentemail: "",
      jntuno: "",
      studentmobile: "",
      studentyear: "",
      branch: "",
    }));
  };

  const formik = useFormik({
    initialValues: {
      studentname: "",
      studentemail: "",
      studentmobile: "",
      jntuno: "",
      studentyear: "",
      branch: "",
      payment: false,
      team: [],
    },
    validationSchema: createValidationSchema(eventDetails?.isTeam, eventDetails?.numberTeamSize),
    enableReinitialize: true,
    onSubmit: (values) => {
      const regData = {
        eventid,
        ...values
      };
      mutation
        .mutateAsync(regData)
        .then((data) => {
          dispatch(registerAction(data));
        })
        .catch((error) => console.error(error));
    },
  });

  // Update form values when event details are loaded
  useEffect(() => {
    if (eventDetails) {
      const newValues = {
        studentname: "",
        studentemail: "",
        studentmobile: "",
        jntuno: "",
        studentyear: "",
        branch: "",
        payment: false,
        team: eventDetails.isTeam ? initializeTeamMembers(eventDetails.numberTeamSize) : [],
      };
      formik.setValues(newValues);
    }
  }, [eventDetails]);

  if (eventLoading) {
    return (
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg space-y-6 mt-20"
    >
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Register Event For {eventname}</h2>
        <p className="text-gray-600">Fill in the details below.</p>
        {eventDetails?.isTeam && (
          <p className="text-blue-600 font-medium">
            This is a team event. Team size: {eventDetails.numberTeamSize} members
          </p>
        )}
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

      <div className="flex flex-col">
        <label htmlFor="studentemail" className="text-gray-700 font-medium">
          <MdAlternateEmail className="inline mr-2 text-blue-500" />
          Student Email
        </label>
        <input
          type="text"
          id="studentemail"
          name="studentemail"
          placeholder="Enter Your Email"
          className="w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 py-2 px-3"
          {...formik.getFieldProps("studentemail")}
        />
        {formik.touched.studentemail && formik.errors.studentemail && (
          <p className="text-sm text-red-600">{formik.errors.studentemail}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="jntuno" className="text-gray-700 font-medium">
          <FaRegIdCard className="inline mr-2 text-blue-500" />
          Jntu No
        </label>
        <input
          type="text"
          id="jntuno"
          name="jntuno"
          placeholder="Jntu No"
          className="w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 py-2 px-3"
          {...formik.getFieldProps("jntuno")}
        />
        {formik.touched.jntuno && formik.errors.jntuno && (
          <p className="text-sm text-red-600">{formik.errors.jntuno}</p>
        )}
      </div>
      <div className="flex flex-col">
        <label htmlFor="studentmobile" className="text-gray-700 font-medium">
          <CiMobile3 className="inline mr-2 text-blue-500" />
          Contact Number
        </label>
        <input
          type="text"
          id="studentmobile"
          name="studentmobile"
          placeholder="Enter Your Contact Number"
          className="w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 py-2 px-3"
          {...formik.getFieldProps("studentmobile")}
        />
        {formik.touched.studentmobile && formik.errors.studentmobile && (
          <p className="text-sm text-red-600">{formik.errors.studentmobile}</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="studentyear"
          className="flex gap-2 items-center text-gray-700 font-medium"
        >
          <MdOutlinePeopleOutline className="text-blue-500" />
          <span>Year</span>
        </label>
        <select
          id="studentyear"
          name="studentyear"
          className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          {...formik.getFieldProps("studentyear")}
        >
          <option value="select">select Your Year</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>
        {formik.touched.studentyear && formik.errors.studentyear && (
          <p className="text-sm text-red-600">{formik.errors.studentyear}</p>
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

      {/* Payment Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="payment"
          name="payment"
          checked={formik.values.payment}
          onChange={formik.handleChange}
          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
        <label htmlFor="payment" className="ml-2 text-gray-700 font-medium">
          <BsFillCreditCard2BackFill className="inline mr-2 text-blue-500" />
          Payment Completed
        </label>
      </div>

      {/* Team Members Section - Only show for team events */}
      {eventDetails?.isTeam && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
            <MdOutlinePeopleOutline className="inline mr-2 text-blue-500" />
            Team Members ({eventDetails.numberTeamSize} members required)
          </h3>
          
          {formik.values.team.map((member, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h4 className="text-lg font-medium text-gray-700">Team Member {index + 1}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-gray-700 font-medium">
                    <MdOutlineDriveFileRenameOutline className="inline mr-2 text-blue-500" />
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Team member name"
                    className="w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 py-2 px-3"
                    value={member.studentname}
                    onChange={(e) => {
                      const newTeam = [...formik.values.team];
                      newTeam[index].studentname = e.target.value;
                      formik.setFieldValue("team", newTeam);
                    }}
                  />
                  {formik.touched.team?.[index]?.studentname && formik.errors.team?.[index]?.studentname && (
                    <p className="text-sm text-red-600">{formik.errors.team[index].studentname}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-700 font-medium">
                    <MdAlternateEmail className="inline mr-2 text-blue-500" />
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Team member email"
                    className="w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 py-2 px-3"
                    value={member.studentemail}
                    onChange={(e) => {
                      const newTeam = [...formik.values.team];
                      newTeam[index].studentemail = e.target.value;
                      formik.setFieldValue("team", newTeam);
                    }}
                  />
                  {formik.touched.team?.[index]?.studentemail && formik.errors.team?.[index]?.studentemail && (
                    <p className="text-sm text-red-600">{formik.errors.team[index].studentemail}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-700 font-medium">
                    <FaRegIdCard className="inline mr-2 text-blue-500" />
                    JNTU No
                  </label>
                  <input
                    type="text"
                    placeholder="Team member JNTU number"
                    className="w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 py-2 px-3"
                    value={member.jntuno}
                    onChange={(e) => {
                      const newTeam = [...formik.values.team];
                      newTeam[index].jntuno = e.target.value;
                      formik.setFieldValue("team", newTeam);
                    }}
                  />
                  {formik.touched.team?.[index]?.jntuno && formik.errors.team?.[index]?.jntuno && (
                    <p className="text-sm text-red-600">{formik.errors.team[index].jntuno}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-700 font-medium">
                    <CiMobile3 className="inline mr-2 text-blue-500" />
                    Mobile
                  </label>
                  <input
                    type="text"
                    placeholder="Team member mobile"
                    className="w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 py-2 px-3"
                    value={member.studentmobile}
                    onChange={(e) => {
                      const newTeam = [...formik.values.team];
                      newTeam[index].studentmobile = e.target.value;
                      formik.setFieldValue("team", newTeam);
                    }}
                  />
                  {formik.touched.team?.[index]?.studentmobile && formik.errors.team?.[index]?.studentmobile && (
                    <p className="text-sm text-red-600">{formik.errors.team[index].studentmobile}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-700 font-medium">
                    <MdOutlinePeopleOutline className="inline mr-2 text-blue-500" />
                    Year
                  </label>
                  <select
                    className="w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 py-2 px-3"
                    value={member.studentyear}
                    onChange={(e) => {
                      const newTeam = [...formik.values.team];
                      newTeam[index].studentyear = e.target.value;
                      formik.setFieldValue("team", newTeam);
                    }}
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                  {formik.touched.team?.[index]?.studentyear && formik.errors.team?.[index]?.studentyear && (
                    <p className="text-sm text-red-600">{formik.errors.team[index].studentyear}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-700 font-medium">
                    <SlLocationPin className="inline mr-2 text-blue-500" />
                    Branch
                  </label>
                  <input
                    type="text"
                    placeholder="Team member branch"
                    className="w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 py-2 px-3"
                    value={member.branch}
                    onChange={(e) => {
                      const newTeam = [...formik.values.team];
                      newTeam[index].branch = e.target.value;
                      formik.setFieldValue("team", newTeam);
                    }}
                  />
                  {formik.touched.team?.[index]?.branch && formik.errors.team?.[index]?.branch && (
                    <p className="text-sm text-red-600">{formik.errors.team[index].branch}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
        <AlertMessage type="success" message="Student Registered successfully!" />
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

export default Registerator;
