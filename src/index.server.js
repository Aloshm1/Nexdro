const express = require("express");
const env = require("dotenv");
const mongoose = require("mongoose");
var fs = require("fs");
const hbs = require('hbs')
var morgan = require("morgan");
var path = require("path");
const cors = require("cors");
var rfs = require("rotating-file-stream");
const app = express();

// var todayDate = new Date().toISOString().slice(0, 10);
// var accessLogStream = rfs.createStream(`${todayDate}.csv`, {
//   interval: "1d",
//   path: path.join(__dirname, "log"),
// });
// morgan.token("body", (req) => {
//   return JSON.stringify(req.body);
// });
// app.use(
//   morgan(
//     `:method , :url , :remote-addr , :status , :response-time , :date[clf] , :body`,
//     { stream: accessLogStream }
//   )
// );

app.use(cors());

//routes
const userRoutes = require("./routes/user");
const jobRouter = require("./routes/jobRoutes");
const service_centerRoutes = require("./routes/service_centerRoutes");
const pilotRoutes = require("./routes/pilotRoutes");
const companyRoutes = require("./routes/companyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const followRoutes = require("./routes/followRoutes");
const imageRoutes = require("./routes/imageRoutes");
const industryRoutes = require("./routes/industryRoutes");
const keywordsRoutes = require("./routes/keywordsRoutes");
const commentsRoutes = require("./routes/commentsRoutes");
const testRoutes = require("./routes/testRoutes");
const skillRoutes = require("./routes/skillRoutes");
const brandsRoutes = require("./routes/brandsRoutes");
const draftRoutes = require("./routes/draftRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const jobApplicationRoutes = require("./routes/jobapplicationRoutes.js");
const hireProposalRoutes = require("./routes/hireProposalRoutes");
const savePilotFolderRoutes = require("./routes/savePilotFolderRoutes");
const savePilotRoutes = require("./routes/savePilotRoutes");
const draftJobRoutes = require("./routes/draftJobRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const pilotSubscriptionRoutes = require("./routes/pilotSubscriptionRoutes");
const queryRoutes = require("./routes/queryRoutes");
const faqRoutes = require("./routes/faqRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const blogRoutes = require("./routes/blogRoutes");
const shootRoutes = require("./routes/shootRoutes");
const tagRoutes = require("./routes/tagRoutes");
const companySubscription = require("./routes/companySubscriptionRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const seoRoutes = require("./routes/seoRoutes");
const recommendedRoutes = require("./routes/recommendedRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const companyPlanRoutes = require("./routes/companyPlanRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const educationRoutes = require("./routes/educationRoutes");
const rearrangeRoutes = require("./routes/rearrangeRoutes");
const complainRoutes = require("./routes/complaintRoutes");
const eventRoutes = require("./routes/eventRoutes");
const replyRoutes=require('./routes/replyRoutes')
//enviroment
env.config();
console.log(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.jxijmw1.mongodb.net/?retryWrites=true&w=majority`)
//mongodb connection
mongoose
  .connect(
    // `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.u7or8.mongodb.net/?retryWrites=true&w=majority`
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.jxijmw1.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Database connected");
  });

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/jobs", jobRouter);
app.use("/api/center", service_centerRoutes);
app.use("/api/pilot", pilotRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/industry", industryRoutes);
app.use("/api/keyword", keywordsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/test", testRoutes);
app.use("/api/skill", skillRoutes);
app.use("/api/brand", brandsRoutes);
app.use("/api/draft", draftRoutes);
app.use("/api/enquiry", enquiryRoutes);
app.use("/api/jobApplications", jobApplicationRoutes);
app.use("/api/hireProposal", hireProposalRoutes);
app.use("/api/folder", savePilotFolderRoutes);
app.use("/api/savePilot", savePilotRoutes);
app.use("/api/draftJob", draftJobRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/query", queryRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/pilotSubscription", pilotSubscriptionRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/shoot", shootRoutes);
app.use("/api/companySubscription", companySubscription);
app.use("/api/tag", tagRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/seo", seoRoutes);
app.use("/api/recommended", recommendedRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/companyPlan", companyPlanRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/rearrange", rearrangeRoutes);
app.use("/api/complain", complainRoutes);
app.use("/api/event", eventRoutes);
app.use('/api/reply',replyRoutes)
app.use("/uploads", express.static("uploads"));
app.use("/profileImages", express.static("profileImages"));
// app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'hbs')

app.get('/', function(req, res){
  
  // Rendering our web page i.e. Demo.ejs
  // and passing title variable through it
  res.render('index', {
      title: 'View Engine Demo'
  })
})

const server = app.listen(process.env.PORT, () => {
  console.log(`server is running on ${process.env.PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 18000000,
  cors: {
    origin: ["http://localhost:3000", "http://13.233.238.116:8000"],
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("newText", (data) => {
    let chat = data.chatData;
    let message = data.messageData;
    chat.users.forEach((user) => {
      if (user == message.sender) {
        socket.in(user).emit("refreshYourChats");
        return;
      }
      socket.in(user).emit("newMessage", chat._id);

      socket.in(user).emit("refresh", chat._id);
    });
  });
  socket.on("typing", (data) => {
    let chat = data.chatData;
    let userId = data.myId;
    chat.users.forEach((user) => {
      if (user == userId) return;
      else {
        socket.in(user).emit("typingMessage", { userId, chatId: chat._id });
      }
    });
  });
  socket.on("typingStopped", (data) => {
    let chat = data.chatData;
    let userId = data.myId;
    chat.users.forEach((user) => {
      if (user == userId) {
        return;
      } else {
        socket.in(user).emit("typingStopped", "stopped");
      }
    });
  });

  socket.on("hello", (data) => {
    console.log(data);
    data.data.forEach((user) => {
      if (data.id == user) {
        socket.in(user).emit("refreshYourChats", "refreshYourChats");
        return;
      }
      socket.in(user).emit("refresh", "refresh");
    });
  });
  socket.on("refreshMyChats", (user) => {
    socket.in(user).emit("refreshYourChats", "refreshYourChats");
  });
  socket.on("reloadMyData", (user) => {
    console.log(user);
    socket.in(user).emit("reloadProfilePic", "reloadProfilePic");
  });
});
