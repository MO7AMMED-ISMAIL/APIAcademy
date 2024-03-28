const express = require('express');
const morgn = require('morgan');
const cors = require("cors");
const mongosse = require("mongoose");
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const specs = require('./swaggerConfig');
const upload = require("./Controller/ImageController");
const teacherRoutes = require("./Routes/teacherRoute");
const childRoutes = require("./Routes/childRoutes");
const classRoutes = require("./Routes/classRoutes");
const loginRoutes = require("./Routes/authentication");
const registerRoutes = require("./Routes/registerRoutes");
const authMW = require("./Midelwares/authenticationMW");
const app = express();
const port = process.env.PORT || 8080;


app.use(upload);
app.use(morgn("tiny"));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(loginRoutes);
app.use(registerRoutes);
app.use(authMW);
app.use(teacherRoutes);
app.use(childRoutes);
app.use(classRoutes);

app.use((request, response) => {
    response.status(404).json({ data: "Not Found" });
});

app.use((error, request, response, next) => {
    response.status(500).json({ data: `Error MW ${error}` });
});



mongosse.connect(process.env.URL)
    .then(()=>{
        console.log("Database is connected");
        app.listen(port, ()=>{
            console.log(`server is running at port no ${port}`);
        });
    })
    .catch((error)=>console.log(`Database is not connected ${error}`));
