import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { regList, registrationsApi } from '../../redux/slice/everegSlice';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import './Regdetails.css';

const Regdetails = () => {
    const dispatch = useDispatch();
    const { eventid } = useParams();

    useEffect(() => {
        dispatch(registrationsApi());
    }, [dispatch]);

    const registrations = useSelector(regList);
    const filteredRegs = Array.isArray(registrations) 
        ? registrations.filter(obj => obj.eventid === eventid) 
        : [];

    const handleDownloadRegs = () => {
        if (filteredRegs.length === 0) {
            alert("No registrations found for this event!");
            return;
        }

        const worksheetData = filteredRegs.map((reg, index) => ({
            "S.No": index + 1,
            "Student Name": reg.studentname,
            "Branch": reg.branch,
            "Year": reg.studentyear,
            "Mobile": reg.studentmobile,
            "Email": reg.studentemail,
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, `Event_${eventid}_Registrations.xlsx`);
    };

    return (
        <center>
            <div className='regdetails'>
                {filteredRegs.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Branch</th>
                                    <th>Year</th>
                                    <th>Mobile</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRegs.map(obj => (
                                    <tr key={obj.regid}>
                                        <td>{obj.studentname}</td>
                                        <td>{obj.branch}</td>
                                        <td>{obj.studentyear}</td>
                                        <td>{obj.studentmobile}</td>
                                        <td>{obj.studentemail}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={handleDownloadRegs} className="download-btn">
                         Download Registrations
                        </button>
                    </>
                ) : (
                    <p className="no-registrations">No Registrations for this event till now.</p>
                )}
            </div>
        </center>
    );
};

export default Regdetails;