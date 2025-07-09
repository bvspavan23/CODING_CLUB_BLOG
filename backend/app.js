require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors')
const http = require("http");
const socketio = require("socket.io");
const socketIo = require("./socket");
const buzzRoutes = require("./Routes/BuzzRouter");
const adminRouter= require("./Routes/AdminRoute");
const eventRouter= require("./Routes/AddEventRoute");
const fetchRouter= require("./Routes/FetchEventRoute");
const deleteRouter= require("./Routes/DeleteEventRoute");
const updateRouter= require("./Routes/UpdateEventRoute");
const eveRegRouter= require("./Routes/EveRegRoute");
const QuestionRoutes=require('./Routes/QuestionRoutes');
const joinRoutes=require('./Routes/JoinRoutes');
const botRoutes=require('./Routes/ChatbotRoutes');
const QuizRoutes=require('./Routes/QuizRoutes');
const cloudinary=require("cloudinary").v2
const errorHandler = require("./middlewares/errHandler");
const app=express();
const PORT = process.env.PORT || 8000;
const URL=process.env.MONGO_URL
const server = http.createServer(app);
mongoose
  .connect(URL)
  .then(() => console.log("DB Connected"))
  .catch((e) => console.log(e));

  cloudinary.config({
    api_key:process.env.CLOUD_API,
    cloud_name:process.env.CLOUD_NAME,
    api_secret:process.env.CLOUD_API_SECRET
  })

  const io = socketio(server, {
  cors: {
    origin: ["https://cc-blog-frontend-ehr1.onrender.com"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["websocket", "polling"]
});
  
  const corsOptions = {
    origin: ["https://cc-blog-frontend-ehr1.onrender.com"], 
    methods: ["GET","POST","PUT","DELETE"],
    credentials: true,
  };

  app.use(cors(corsOptions));
  app.use(express.json());
  
  app.use("/",adminRouter);
  app.use("/",eventRouter);
  app.use("/",fetchRouter);
  app.use("/",deleteRouter);
  app.use("/",updateRouter);
  app.use("/",eveRegRouter);
  app.use("/",buzzRoutes);
  app.use("/",QuizRoutes);
  app.use("/",QuestionRoutes);
  app.use("/",joinRoutes);
  app.use("/",botRoutes);
  
  app.use(errorHandler);

  socketIo(io);

  server.listen(PORT, () =>
    console.log(`Server is running on this port... ${PORT} `)
)
