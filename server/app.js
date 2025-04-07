const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const https = require('https');
const fs = require('fs');

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

// Загрузка сертификатов
try {
  const privateKey = fs.readFileSync('ssl/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('ssl/fullchain.pem', 'utf8');
  const credentials = { key: privateKey, cert: certificate };

  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(3001, () => {
    console.log('HTTPS server listening on port 3001');
  });

} catch (error) {
  console.error("Error loading certificates or starting HTTPS server:", error);
  //Если не получается запустить https, все равно запустим http, но с предупреждением.
  app.listen(3001, () => {
    console.warn('WARNING: HTTPS failed to start. Starting HTTP server on port 3001. HTTPS is recommended for production.');
    console.log('HTTP server started on port 3001');
  });
}