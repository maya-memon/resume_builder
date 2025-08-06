const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "https://maya-resume-builder.netlify.app",
    credentials: true,
  })
);
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));
  

app.use('/api/auth', require('./routes/auth'));
console.log('🚀 Loading documentRoutes...');
app.use('/api/documents', require('./routes/documentRoutes'));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
