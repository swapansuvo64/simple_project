// src/components/Log.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from '../firebase.init';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import '../App.css';

const Log = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [signInWithEmailAndPassword, user, loading, signInError] = useSignInWithEmailAndPassword(auth);

    useEffect(() => {
        if (user) {
            navigate('/home');
        }
        if (signInError) {
            setError(signInError.message);
        }
    }, [user, navigate, signInError]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        await signInWithEmailAndPassword(email, password);
    };

    return (
        <div className="login">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
            <p>
                Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
        </div>
    );
};

export default Log;