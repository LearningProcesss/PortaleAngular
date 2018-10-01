require('./config/config');
const db = require("./db/db");
var cookieParser = require('cookie-parser')
const express = require("express");
const bodyParser = require("body-parser");
const mongoRouteMid = require("./middlewares/routeToMongo")
const path = require('path')
const d = require('debug')("app:app")

const ticketsRoutes = require('./routes/tickets')
const authRoutes = require("./routes/auth")
const usersRoutes = require("./routes/users")
const schemasRoutes = require("./routes/schemas")

const { Ticket } = require("./models/ticket")
const { PortalUser } = require("./models/portaluser")

const app = express();

d('path /uploads: %s', path.join(__dirname, './public/images/portaleuploads'))

app.use("/uploads", express.static(path.join(__dirname, 'public/images/portaleuploads')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser())

app.use(mongoRouteMid({
  routeUser:
  {
    routeUrl: "/api/portale/users", db: db.mongoose, model: PortalUser
  },
  routeTicket:
  {
    routeUrl: "/api/portale/tickets", db: db.mongoose, model: Ticket
  }
}))

app.use((req, resp, next) => {
  resp.setHeader("Access-Control-Allow-Origin", "*");
  resp.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-Width, Content-Type, Accept, Authorization"
  );
  resp.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );req.
  next();
});

app.use("/api/portale/tickets", ticketsRoutes);
app.use("/api/portale/auth", authRoutes);
app.use("/api/portale/users", usersRoutes);
app.use("/api/portale/schema", schemasRoutes);

// app.use((req, resp) => {
//   resp.sendfile(path.join(__dirname, "mean-course", "index.html"));
// });

module.exports = app;


