const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const { default: rateLimit } = require("express-rate-limit");

const UserRoute = require("../modules/users/user.route.js");
const ContactRoute = require("../modules/contacts/contact.route.js");
const OrderRoute = require("../modules/orders/order.route.js");

const app = express();

app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:3000",
    "https://tbc-frontend-rho.vercel.app",
    "https://tbc-admin-one.vercel.app",
    "https://theblissco.vercel.app",
    "https://cnc-frontend-sage.vercel.app",
    "https://cnc-admin-five.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

app.use(helmet({
    crossOriginResourcePolicy: false
}));
app.use(compression());
app.use(morgan('dev'));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300
});

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "theblissco Backend API is running smoothly on Vercel"
    });
});

app.use("/users", limiter, UserRoute);
app.use("/contacts", limiter, ContactRoute);
app.use("/orders", limiter, OrderRoute);

module.exports = app;
