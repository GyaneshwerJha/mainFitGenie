const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const cors = require('cors')
const PORT = 8000;
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const calorieIntakeRoutes = require('./routes/calorieIntake');
const adminRoutes = require('./routes/admin');
const imageUploadRoutes = require('./routes/imageUploadRoutes');
const sleepTrackRoutes = require('./routes/sleepTrack');
const stepTrackRoutes = require('./routes/sleepTrack');
const weightTrackRoutes = require('./routes/weightTrack');
const waterTrackRoutes = require('./routes/waterTrack');
const workoutTrackRoutes = require('./routes/workoutTrack');
const workoutRoutes = require('./routes/workoutPlans');
const reportRoutes = require('./routes/report');


require('dotenv').config();
require('./db')

app.use(bodyParser.json())
const allowedOrigins = ['http://localhost:3000'];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    })
)

app.use(cookieParser())

app.use('/api/auth', authRoutes);
app.use('/api/calorieIntake', calorieIntakeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/imageUpload', imageUploadRoutes);
app.use('/api/sleetTrack', sleepTrackRoutes);
app.use('/api/stepTrack', stepTrackRoutes);
app.use('/api/weightTrack', weightTrackRoutes);
app.use('/api/waterTrack', waterTrackRoutes);
app.use('/api/workoutTrack', workoutTrackRoutes);
app.use('/api/workoutPlans', workoutRoutes);
app.use('/api/report', reportRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'The Api is working!' })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

