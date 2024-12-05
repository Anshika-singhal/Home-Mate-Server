// require('dotenv').config();
// const express=require('express');
// const mongoose=require('mongoose');
// const bodyParser =require('body-parser');
// var cors = require('cors');
// var cookieParser = require('cookie-parser');
// const axios = require('axios');
// const categoryRouter=require('./routes/categories');
// const users = require('./authentication/route/auth');
// const controller=require('./controller/authController');
// const app=express();

// app.use(cors({
//     origin: ["http://127.0.0.1:5500", "https://home-mate-server-ekkv.onrender.com"],
//     credentials:true
// }));


// const mongourl=process.env.database;
// //work as a middleware
// app.use(bodyParser.json());
// app.use(cookieParser());
// app.use(express.json());
// app.use('/api',users);
// app.use('/api',categoryRouter);
// // app.use('/api',controller);
// app.use('/api/forgotPassword', controller.forgotPassword);
// app.use('/api/resetPassword', controller.resetPassword);

// //mongoose.connect
// mongoose.connect(mongourl)
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.log(err));

// // app.use('/api',authRouter);
// // app.use(express.json());
// //routes

// // app.use('/api',categories);
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// // console.log(categoryRouter);  // Should log the router, not an object
// // console.log(users);  // Should also log the router

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const categoryRouter = require('./routes/categories');
const users = require('./authentication/route/auth');
const controller = require('./controller/authController');
const app = express();

// Dynamic CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        console.log(`CORS origin check: ${origin}`);
        const allowedOrigins = ["https://home-mate-w83w.onrender.com", "http://127.0.0.1:5500","http://localhost:5000"];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`Blocked by CORS: ${origin}`);
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies or tokens
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Ensure preflight requests are handled

// app.use(cors({
//         origin: ["http://127.0.0.1:5500", "http://localhost:5000"],
//         credentials:true
//     }));
    
// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api', users);
app.use('/api', categoryRouter);
app.use('/api/forgotPassword', controller.forgotPassword);
app.use('/api/resetPassword', controller.resetPassword);

// MongoDB Connection
const mongourl = process.env.database;
mongoose.connect(mongourl)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
