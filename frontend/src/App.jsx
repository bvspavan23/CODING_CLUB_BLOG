import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useEffect } from 'react';
import { useDispatch } from "react-redux";
import './index.css';
import Navbar from './components/Nav/Navbar.jsx';
import Head from './components/Head/Head.jsx';
import People from './components/Team/People.jsx';
import Signin from './components/Login/signin.jsx'
import PrivateNav from './components/Nav/PrivateNav.jsx';
import EventAdder from './components/eves/AddEvent.jsx';
import PublicEve from './components/eves/PublicEve.jsx';
import AuthRoute from './components/Auth/AuthRoute.jsx';
import EveList from './components/eves/EveList.jsx';
import EventInfo from './components/eves/EventInfo.jsx';
import EventUpdater from './components/eves/UpdateEve.jsx';
import { eventlistApi } from './redux/slice/eventSlice.js';
import Register from './components/eves/Register.jsx';
import About from './components/About/About.jsx';
import Regdetails from './components/Studentregs/Regdetails.jsx';
function App(){
  
  const dispatch = useDispatch();
  const user=useSelector((state)=>state?.auth?.user);

  useEffect(() => {
    dispatch(eventlistApi());
  }, [dispatch]);

  return(
    <Router> 
      
      {user ? <PrivateNav/> : <Navbar/>}

      <Routes>
        <Route path="/" element={<Head />}/>
        <Route path="/team" element={<People/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/admin" element={<Signin/>}/> 
        <Route path="/events" element={<PublicEve/>}/> 
        <Route path="/event/eventinfo/:eventname/:eventid" element={<EventInfo/>}/>
        <Route path="/event/register/:eventname/:eventid" element={<Register/>}/>
        <Route 
          path="/edit/add/eve" 
          element={
            <AuthRoute>
              <EventAdder />
            </AuthRoute>
          } 
        />
        <Route 
          path="/edit/botpapi/list/events" 
          element={
            <AuthRoute>
              <EveList/>
            </AuthRoute>
          } 
        /> 
        <Route 
          path="/event/eventinfo/update/:eventname/:eventid" 
          element={
            <AuthRoute>
              <EventUpdater/>
            </AuthRoute>
          } 
        /> 
        <Route 
          path="/event/admin/studentregs/:eventid" 
          element={
            <AuthRoute>
              <Regdetails/>
            </AuthRoute>
          } 
        /> 
      </Routes>
    </Router>
  )
}
export default App;