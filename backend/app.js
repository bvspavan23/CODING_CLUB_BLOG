require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors')
const adminRouter= require("./Routes/AdminRoute");
const eventRouter= require("./Routes/AddEventRoute");
const fetchRouter= require("./Routes/FetchEventRoute");
const deleteRouter= require("./Routes/DeleteEventRoute");
const updateRouter= require("./Routes/UpdateEventRoute");
const cloudinary=require("cloudinary").v2
const errorHandler = require("./middlewares/errHandler");
const app=express();
const PORT = process.env.PORT || 8000;
const URL=process.env.MONGO_URL
mongoose
  .connect(URL)
  .then(() => console.log("DB Connected"))
  .catch((e) => console.log(e));

  cloudinary.config({
    api_key:process.env.CLOUD_API,
    cloud_name:process.env.CLOUD_NAME,
    api_secret:process.env.CLOUD_API_SECRET
  })
  const corsOptions = {
    origin: ["https://cc-blog-frontend-ehr1.onrender.com"], 
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // Enable if using authentication or cookies
  };
  
  app.use(cors(corsOptions));
  

  app.use(express.json());

  app.use("/",adminRouter);
  app.use("/",eventRouter);
  app.use("/",fetchRouter);
  app.use("/",deleteRouter);
  app.use("/",updateRouter);
  
  app.use(errorHandler);

  app.listen(PORT, () =>
    console.log(`Server is running on this port... ${PORT} `)
)