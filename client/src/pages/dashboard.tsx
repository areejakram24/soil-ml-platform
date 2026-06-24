import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import axios from 'axios';
import { useAuth } from '../context/authContext';

interface Analysis {
  _id: string;
  name: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
  predictedCrop: string;
  status: string;
  createdAt: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchAnalyses = async () => {
      try {
        const response = await api.get('/soil-analysis');
        if (isMounted) {
          setAnalyses(response.data.analyses || []);
        }
      } catch (err) {
        if (isMounted) {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.error || 'Failed to fetch soil metrics');
          } else {
            setError('An unexpected error occurred loading data');
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAnalyses();
    return () => { isMounted = false; };
  }, []);

  const handleDelete = async (id: string) => {
    // Standard approach over native browser confirm blocks
    const confirmation = window.confirm('Are you sure you want to discard this analysis record?');
    if (!confirmation) return;

    try {
      await api.delete(`/soil-analysis/${id}`);
      setAnalyses(prev => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Delete transaction failed:', err);
      alert('Could not complete deletion. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <h1 className="text-xl font-bold text-emerald-800 tracking-tight">Soil Analytics</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 hidden sm:inline">User: {user?.name}</span>
            <button
              onClick={() => navigate('/new-analysis')}
              className="bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              New Analysis
            </button>
            <button
              onClick={handleLogout}
              className="border border-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-2"></div>
            <p className="text-sm text-gray-500">Retrieving records history...</p>
          </div>
        ) : analyses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm max-w-xl mx-auto px-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
              <span className="text-emerald-600 font-bold text-lg">🌾</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">No telemetry entries recorded</h3>
            <p className="text-sm text-gray-500 mt-1 mb-6">Create your initial profile matrix to run crop predictions.</p>
            <button
              onClick={() => navigate('/new-analysis')}
              className="bg-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Create Your First Analysis
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyses.map((analysis) => (
              <div key={analysis._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-lg font-bold text-gray-800 line-clamp-1">{analysis.name}</h2>
                    <span className="text-xs text-gray-400 font-medium">{formatDate(analysis.createdAt)}</span>
                  </div>
                  
                  {/* Soil Compound Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center bg-gray-50 rounded-lg p-2.5 mb-4 text-xs font-medium text-gray-600">
                    <div><span className="block text-[10px] text-gray-400 font-bold">N</span>{analysis.nitrogen}</div>
                    <div><span className="block text-[10px] text-gray-400 font-bold">P</span>{analysis.phosphorus}</div>
                    <div><span className="block text-[10px] text-gray-400 font-bold">K</span>{analysis.potassium}</div>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-500 border-b border-gray-100 pb-4 mb-4">
                    <p>🌡️ <span className="font-semibold text-gray-600">Temp:</span> {analysis.temperature}°C</p>
                    <p>💧 <span className="font-semibold text-gray-600">Humidity:</span> {analysis.humidity}%</p>
                    <p>🧪 <span className="font-semibold text-gray-600">Soil pH:</span> {analysis.ph}</p>
                    <p>🌧️ <span className="font-semibold text-gray-600">Rainfall:</span> {analysis.rainfall}mm</p>
                  </div>
                </div>

                <div>
                  {/* Status Blocks */}
                  <div className="mb-4">
                    {analysis.status === 'completed' ? (
                      <div className="bg-emerald-50 border border-emerald-100 px-3 py-2.5 rounded-lg">
                        <span className="block text-[10px] uppercase tracking-wider font-bold text-emerald-800">Target Crop Recommendation</span>
                        <p className="text-base font-bold text-emerald-800 mt-0.5">{analysis.predictedCrop}</p>
                      </div>
                    ) : analysis.status === 'failed' ? (
                      <div className="bg-red-50 border border-red-100 p-3 rounded-lg text-xs font-semibold text-red-700">
                        Matrix Processing Error
                      </div>
                    ) : (
                      <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg text-xs font-semibold text-amber-700 animate-pulse">
                        Analyzing model vectors...
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(analysis._id)}
                    className="w-full text-center border border-gray-100 text-gray-400 text-xs py-2 rounded-lg hover:text-red-600 hover:bg-red-50 hover:border-red-100 font-medium transition-all"
                  >
                    Delete Entry
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}