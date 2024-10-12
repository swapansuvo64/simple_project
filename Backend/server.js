const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3'); // AWS SDK v3
const multerS3 = require('multer-s3');
const cors = require('cors');

// Initialize the Express app
const app = express();

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(express.json());

// MongoDB Atlas Connection
const uri = "mongodb+srv://Roni:3JT0brptvrBKtIQW@cluster0.kardea6.mongodb.net/user-auth?retryWrites=true&w=majority";
mongoose.connect(uri)
    .then(() => {
        console.log('Connected to MongoDB successfully');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// AWS SDK v3 Configuration
const s3Client = new S3Client({
    region: 'ap-south-1', // Replace with your region
    credentials: {
        accessKeyId: 'AKIA5V6I7AINABNMVZGF', // Replace with your AWS access key
        secretAccessKey: 'lCHKezn61RlFKba5eYeA7S/p8l8W2BWFeaLOy1CG', // Replace with your AWS secret key
    },
});

// Set up multer storage for AWS S3 using AWS SDK v3
const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: 'suvadeep-image-bucket', // Replace with your S3 bucket name
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname); // File name in the S3 bucket
        },
    }),
});

// Image Schema and Model (for storing image metadata)
const imageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    views: { type: Number, default: 0 }, // Initialize views to 0
});

const Image = mongoose.model('Image', imageSchema);
app.get('/', (req, res) => {
    res.send('Hello World'); // Send "Hello World" as the response
});
// Image upload route
app.post('/image-upload', upload.single('image'), async (req, res) => {
    try {
        const { title, description } = req.body;

        // Check if file exists
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const imageUrl = req.file.location; // URL of the uploaded image in AWS S3

        // Save image info to MongoDB
        const image = new Image({
            title,
            description,
            imageUrl,
        });

        await image.save();

        res.status(201).json({ message: 'Image uploaded successfully', image });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Image upload failed', error: error.message });
    }
});

// Fetch images and update views count
// Inside your existing Express app code

// Route to increment view count for a specific image
app.get('/images/:id', async (req, res) => {
    const imageId = req.params.id;
    try {
        // Find the image by ID and increment the views
        const image = await Image.findById(imageId);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        // Increment the views
        image.views += 1;
        await image.save(); // Save the updated image document

        res.json(image); // Return the updated image data
    } catch (error) {
        console.error('Error incrementing view count:', error);
        res.status(500).json({ message: 'Failed to increment view count', error: error.message });
    }
});

// Fetch all images
app.get('/images', async (req, res) => {
    try {
        const images = await Image.find();
        res.json(images);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ message: 'Failed to fetch images', error: error.message });
    }
});



// Inside your existing Express app code

// Route to delete a specific image
app.delete('/images/:id', async (req, res) => {
    const imageId = req.params.id;
    try {
        const deletedImage = await Image.findByIdAndDelete(imageId);
        if (!deletedImage) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: 'Failed to delete image', error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
