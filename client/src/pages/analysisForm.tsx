import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import axios from 'axios';

export default function AnalysisForm() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/soil-analysis', {
        name: formData.name,
        nitrogen: parseFloat(formData.nitrogen),
        phosphorus: parseFloat(formData.phosphorus),
        potassium: parseFloat(formData.potassium),
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        ph: parseFloat(formData.ph),
        rainfall: parseFloat(formData.rainfall),
      });
      
      navigate('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to submit metrics profile');
      } else {
        setError('An unexpected telemetry processing error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const soilMetrics = [
    { name: 'nitrogen', label: 'Nitrogen (N)', unit: 'mg/kg', placeholder: 'e.g., 42.0' },
    { name: 'phosphorus', label: 'Phosphorus (P)', unit: 'mg/kg', placeholder: 'e.g., 25.5' },
    { name: 'potassium', label: 'Potassium (K)', unit: 'mg/kg', placeholder: 'e.g., 38.1' },
    { name: 'temperature', label: 'Ambient Temperature', unit: '°C', placeholder: 'e.g., 28.4' },
    { name: 'humidity', label: 'Relative Humidity', unit: '%', placeholder: 'e.g., 65.0' },
    { name: 'ph', label: 'Soil pH Balance', unit: 'pH', placeholder: 'e.g., 6.5' },
    { name: 'rainfall', label: 'Annual Rainfall', unit: 'mm', placeholder: 'e.g., 200.4' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Back navigation element */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 mb-6 transition-colors"
        >
          ← Return to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="border-b border-gray-100 pb-5 mb-6">
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">New Telemetry Profile</h1>
            <p className="text-sm text-gray-500 mt-1">Input current soil matrix metrics for model validation and inference.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Analysis Identification Identifier
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g., Sector 4 - Plot B Entry"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {soilMetrics.map((metric) => (
                <div key={metric.name}>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                    {metric.label} <span className="text-gray-400 lowercase font-normal">({metric.unit})</span>
                  </label>
                  <input
                    type="number"
                    name={metric.name}
                    step="0.01"
                    placeholder={metric.placeholder}
                    value={formData[metric.name as keyof typeof formData]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    required
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 mt-4"
            >
              {loading ? 'Evaluating Model Vectors...' : 'Execute Crop Prediction'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}