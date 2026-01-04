const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require('cors')

//dotenv configration
dotenv.config();
connectDB();

const app = express();
app.use(cors())
app.use(express.json());// json data handle
app.use(express.urlencoded({ extended: true }));

//user routes
app.use("/api/auth", require("./routes/auth.routes"));

//employe routes
app.use('/employe', require('./routes/employe.routes'))


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
