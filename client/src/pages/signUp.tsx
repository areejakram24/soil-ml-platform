import axios from 'axios';

import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { Link } from 'react-router-dom';

import soilAppClient from '../utils/api'; 
import { useAuth } from '../context/authContext.tsx';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  //const [fullName, setFullName] = useState('');
  //const [email, setEmail] = useState('');
  //const [password, setPassword] = useState('');
  //const [userLocation, setUserLocation] = useState('');
  const [formFields, setFormFields] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  //input handlers
const updateField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormFields(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateAccount = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    
   // const payload = {
     // name: fullName,
      //email,
      //password,
      //location: userLocation,
    //};

   try {
      const res = await soilAppClient.post('/auth/signup', formFields);
      const { token, user } = res.data;
    
      login(token, user);
      navigate('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Look for custom error payload message sent by authController
        const serverMessage = error.response?.data?.error;
        setErrorMessage(serverMessage || 'Signup failed. Please try again.');
      } else {
        // Fallback for non-network errors (e.g., synchronous JS failures)
        setErrorMessage('An unexpected error occurred.');
        console.error('Non-Axios Signup Error:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-500 to-blue-600">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Soil Analytics</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Create Account</h2>
        
        {errorMessage && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{errorMessage}</div>}
        
        <form onSubmit={handleCreateAccount} className="space-y-4">
          <input
            type="text"
            name="name" // The name attribute must EXACTLY match the key in formFields state
            placeholder="Full Name"
            value={formFields.name}
            onChange={updateField}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formFields.email}
            onChange={updateField}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formFields.password}
            onChange={updateField}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location (optional)"
            value={formFields.location}
            onChange={updateField}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-green-500 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;