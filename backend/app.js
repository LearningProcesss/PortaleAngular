require('./config/config');
const db = require("./db/db");
var cookieParser = require('cookie-parser')
const express = require("express");
const bodyParser = require("body-parser");
const mongoRouteMid = require("./middlewares/routeToMongo")

const ticketsRoutes = require('./routes/tickets');
const usersRoutes = require("./routes/users")

const { Ticket } = require("./models/ticket")
const { PortalUser } = require("./models/portaluser")

const app = express();


// app.use("/images", express.static(path.join("images")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser())

app.use(mongoRouteMid({
  routeUser:
  {
    routeUrl: "/api/users", schema: PortalUser.schema, model: PortalUser
  },
  routeTicket:
  {
    routeUrl: "/api/tickets", schema: Ticket.schema, model: Ticket
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

app.use("/api/tickets", ticketsRoutes);
app.use("/api/users", usersRoutes);

// app.use((req, resp) => {
//   resp.sendfile(path.join(__dirname, "mean-course", "index.html"));
// });

module.exports = app;


