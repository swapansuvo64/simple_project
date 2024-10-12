// src/components/Sign.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from '../firebase.init';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';


const Sign = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [createUserWithEmailAndPassword, user, loading, signUpError] = useCreateUserWithEmailAndPassword(auth);

    useEffect(() => {
        if (user) {
            navigate('/home');
        }
        if (signUpError) {
            setError(signUpError.message);
        }
    }, [user, navigate, signUpError]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        await createUserWithEmailAndPassword(email, password);
    };

    return (
        <div className="sign">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Sign Up</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
};

export default Sign;
