const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const commentRoutes = require('./routes/commentRoutes');
const priorityRoutes = require('./routes/priorityRoutes');
const statusRoutes = require('./routes/statusRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/tickets', ticketRoutes);
app.use('/users', userRoutes);
app.use('/roles', roleRoutes);
app.use('/tickets', commentRoutes);
app.use('/priorities', priorityRoutes);
app.use('/statuses', statusRoutes);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});