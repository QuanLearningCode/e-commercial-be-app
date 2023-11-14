const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const http = require("http");
const { Server } = require("socket.io");
const multer = require("multer");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/order");
const adminRoutes = require("./routes/admin");
const consultantRoutes = require("./routes/consultant");

const Chat = require("./models/Chat");

const app = express();

const store = new MongoDBStore({
  uri: "mongodb+srv://quanfunix:amThAtXoM1WrEwfl@cluster0.zcfk8wp.mongodb.net/Asm3-Data?retryWrites=true&w=majority&appName=AtlasApp",
  collection: "sessions",
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, "../admin/src/components/images");
  },
  filename: (req, file, cb) => {
    return cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    return cb(null, true);
  } else {
    return cb(null, false);
  }
};
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE"],
    credentials: true,
  })
);
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).array("images", 4)
);
app.use(express.json());

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "secret-session",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      secure: false,
      // maxAge: 1000 * 60 * 5,
      //httpOnly: true,
    },
  })
);

app.use((error, req, res, next) => {
  res.status(500).json([{ msg: "Server Error" }]);
});

app.use(authRoutes);
app.use(productRoutes);
app.use(orderRoutes);
app.use(adminRoutes);
app.use(consultantRoutes);

mongoose
  .connect(
    "mongodb+srv://quanfunix:amThAtXoM1WrEwfl@cluster0.zcfk8wp.mongodb.net/Asm3-Data?retryWrites=true&w=majority&appName=AtlasApp"
  )
  .then((result) => {
    const server = http.createServer(app);
    server.listen(5000, () => {
      console.log("Server Connected");
    });
    const io = new Server(server, {
      cors: ["http://localhost:3000", "http://localhost:3001"],
      methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    });
    io.on("connection", (socket) => {
      // socket.on("join", () => {
      //   const newChat = new Chat({
      //     chatId: socket.id,
      //     conversation: [],
      //   });
      //   newChat.save();
      // });
      socket.on("message", (chatId, message) => {
        if (!chatId) {
          chatId = socket.id.toString();
        }
        // Chat.findOne({ chatId: chatId })
        //   .then((chat) => {
        //     chat.conversation.push(message);
        //     chat.save();
        //     if (message.role === "consultant") {
        //       socket.broadcast.to(chatId).emit("transport-message", chatId);
        //     } else {
        const transportMessage = {
          chatId: chatId,
          message: message,
        };
        socket.broadcast.emit("transport-message", transportMessage);
        //     }
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });
      });

      socket.on("disconnection", async () => {
        await Chat.deleteOne({ chatId: socket.id });
      });
    });
  })
  .catch((err) => console.log(err));
