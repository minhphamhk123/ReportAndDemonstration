import express from 'express';

import { connectDB } from './config/db.js';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import docsRouter from './routes/document.route.js';
import { getSingleDoc } from "./controllers/document.controller.js";
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import authCheck from './middleware/auth.middleware.js';
import { Server } from 'socket.io';
import Document from './models/document.model.js';

const __dirname = path.resolve();

const app = express();

// Sử dụng cors middleware
app.use(cors());
// app.use(express.static(path.join(__dirname, '/client/dist')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
// });

app.use(express.json());

app.use(cookieParser());
// App listener
const server = app.listen(process.env.PORT || 8080, async () => {
  console.log(`Server running on port ${process.env.PORT || 8080}`);
  try {
    console.log('⏳ Database connecting...');
    await connectDB;
    console.log('✅ Database connected.');
  } catch (error) {
    console.log('❌ Error:', error);
  }
});

app.use('/api/auth', authRoutes);


app.use('/docs', docsRouter); // Routes for documents
//app.use(authCheck);
app.use("/api/user", userRoutes);

const io = new Server(server, {
  cors: {
    //origin: 'https://doc-depot-by-atanu.vercel.app',
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH'],
  },
});

io.on("connection", (socket) => {
  socket.on("get-document", async documentId => {
    const document = await getSingleDoc(documentId);
    socket.join(documentId);
    socket.emit("load-document", document);

    socket.on("send-changes", delta => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async data => {
      await Document.findByIdAndUpdate(documentId, { doc: data });
    });
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
//JSON.stringify(preContent, null, 2)
app.post('/createDocumentWithContent', async (req, res) => {
  try {
    const accessToken = req.body.token;
    const documentId = req.body.documentId;

    const response = await fetch(`https://docs.googleapis.com/v1/${documentId}:batchUpdate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              location: {
                index: 3, // Adjust the index based on your requirements
              },
              text: `https://docs.google.com/document/d/${documentId}`,
            },
          },
        ],
      }),
    });

    console.log(response);

    if (!response.ok) {
      throw new Error('Failed to create document with content');
    }

    const responseData = await response.json();
    res.json({ documentId: responseData.documentId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});