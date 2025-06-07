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
import BuzzList from './components/Buzz/Buzzlist.jsx';
import CreateBuzz from './components/Buzz/CreateBuzz.jsx';
import AdminBuzz from './components/Buzz/AdminBuzz.jsx';
import JoinRoom from './components/Buzz/JoinRoom.jsx';
import Buzz from './components/Buzz/Buzz.jsx';
import QuizRegister from "./components/Quiz/QuizRegister.jsx";
import QuizTest from "./components/Quiz/QuizTest.jsx";
import Join from "./components/Quiz/Join.jsx";
import End from "./components/Quiz/End.jsx";
import QuizList from "./components/Quiz/QuizList.jsx";
import AddQuiz from "./components/Quiz/AddQuiz.jsx";
import ManageQuiz from "./components/Quiz/ManageQuiz.jsx";
import HostQuiz from "./components/RealTime/HostQuiz.jsx";
import Leaderboard from "./components/Quiz/LeaderBoard.jsx";
import Update from "./components/Quiz/Update.jsx";
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
        <Route path="/join-buzz" element={<JoinRoom/>}/>
        <Route path="/buzzer/:roomId" element={<Buzz/>}/>
        <Route path="/quizzes/register" element={<QuizRegister />} />
        <Route path="/quizzes/:id/:joinId/:roomId" element={<QuizTest />} />
        <Route path="/quizzes/join-quizz" element={<Join />} />
        {/* <Route path="/chat-bot" element={<ChatBot />} /> */}
        <Route path="/quiz/end" element={<End/>} />
        <Route 
          path="/edit/add/eve" 
          element={
            <AuthRoute>
              <EventAdder />
            </AuthRoute>
          } 
        />
        <Route 
          path="/CC/create-buzz" 
          element={
            <AuthRoute>
              <CreateBuzz/>
            </AuthRoute>
          } 
        />
        <Route 
          path="/CC/buzzes" 
          element={
            <AuthRoute>
              <BuzzList/>
            </AuthRoute>
          } 
        />
        <Route 
          path="/manage/:roomId" 
          element={
            <AuthRoute>
              <AdminBuzz/>
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
         <Route
          path="/admin/quizzes"
          element={
            <AuthRoute>
              <QuizList />
            </AuthRoute>
          }
        />
        <Route
          path="/create-quizz"
          element={
            <AuthRoute>
              <AddQuiz />
            </AuthRoute>
          }
        />
        <Route
          path="/quiz/update/:id"
          element={
            <AuthRoute>
              <Update/>
            </AuthRoute>
          }
        />
        <Route
          path="/manage/quiz/:id"
          element={
            <AuthRoute>
              <ManageQuiz />
            </AuthRoute>
          }
        />
        <Route
          path="/host-quiz/:roomId/:id"
          element={
            <AuthRoute>
              <HostQuiz/>
            </AuthRoute>
          }
        />
        <Route
          path="/quizzes/leaderboard/:QuizId"
          element={
            <AuthRoute>
              <Leaderboard/>
            </AuthRoute>
          }
        />
      </Routes>
    </Router>
  )
}
export default App;