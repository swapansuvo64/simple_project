// src/components/Home.jsx
import React, { useEffect, useState } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase.init';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Ensure to import the CSS file

const Home = () => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);
    const [images, setImages] = useState([]);

    const handleLogout = () => {
        auth.signOut().then(() => {
            navigate('/login');
        }).catch((error) => {
            console.error('Error signing out:', error);
        });
    };

    const handleFileChange = (event) => {
        setImageFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!imageFile) return;

        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('title', 'Uploaded Image'); // Customize this as needed
        formData.append('description', 'Description of the uploaded image'); // Customize this as needed

        try {
            const response = await fetch('http://15.207.100.237:8000/image-upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Image upload failed');
            }

            const data = await response.json();
            console.log('Upload successful:', data);
            fetchImages(); // Refresh the image list after upload
            setImageFile(null); // Reset the file input
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const fetchImages = async () => {
        try {
            const response = await fetch('http://15.207.100.237:8000/images');
            if (!response.ok) {
                throw new Error('Failed to fetch images');
            }
            const data = await response.json();
            setImages(data);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    const incrementViewCount = async (imageId) => {
        try {
            const response = await fetch(`http://15.207.100.237:8000/images/${imageId}`, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error('Failed to increment view count');
            }
            const data = await response.json();
            console.log('Fetched image data:', data);
        } catch (error) {
            console.error('Error incrementing view count:', error);
        }
    };

    const handleDelete = async (imageId) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            try {
                const response = await fetch(`http://15.207.100.237:8000/images/${imageId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete image');
                }

                console.log('Image deleted successfully');
                fetchImages(); // Refresh the image list after deletion
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        }
    };

    useEffect(() => {
        fetchImages(); // Fetch images on component mount
    }, []);

    const handleImageLoad = (imageId) => {
        incrementViewCount(imageId); // Increment view count when the image loads
    };

    const getTotalViews = (image) => {
        return image.views || 0; // If views is undefined, return 0
    };

    return (
        <div className="home-container">
            <h2 className="account-info">Welcome, {user ? user.email : 'Guest'}</h2>
            <button className="logout-button" onClick={handleLogout}>Logout</button>

            {/* Image Upload Section */}
            <div className="upload-section">
                <h3>Upload an Image</h3>
                <input type="file" onChange={handleFileChange} />
                <button className="upload-button" onClick={handleUpload}>Upload</button>
            </div>

            {/* Render Uploaded Images Section */}
            <h3>Uploaded Images</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {images.map((image) => (
                    <div key={image._id} className="image-card">
                        <img 
                            src={image.imageUrl} 
                            alt={image.title} 
                            onLoad={() => handleImageLoad(image._id)} // Increment view count when image loads
                        />
                        <p>{image.title}</p>
                        <p className="views-count">Views: {getTotalViews(image)}</p> {/* Show total views */}
                        <button className="delete-button" onClick={() => handleDelete(image._id)}>Delete</button> {/* Delete button */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
