import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieparser from 'cookie-parser'
import DbCon from './utlis/db.js'
import AuthRoutes from './routes/Auth.js'
import Upload from './routes/Upload.js'
import jobRoutes from './routes/jobRoutes.js'
import multer from 'multer'
import AdminRoutes from './routes/AdminRoutes.js'
import clientRoutes from './routes/clientRoutes.js'
dotenv.config()
const PORT=process.env.PORT || 3000
const app=express()

// mongo db 
DbCon()
app.use(express.json())
app.use(cookieparser())
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173' ,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
}));

app.use('/api',AuthRoutes)
app.use('/uploads', express.static('uploads'));
app.use('/api', Upload);
app.use('/api',clientRoutes)
app.use('/api/jobs', jobRoutes);
app.use('/api/admin',AdminRoutes)

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        res.status(400).json({ success: false, message: err.message });
    } else {
        next(err);
    }
});
app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})