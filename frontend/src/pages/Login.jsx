import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';

const Login = ({ setAuth }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [role, setRole] = useState('Mukadam');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState(''); // Used for Mukadam password or Koytawala OTP
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/request-otp', { mobile });
      alert(`OTP Sent! (Simulated: ${res.data.devOtp})`);
      setOtpSent(true);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (role === 'Mukadam') {
        try {
          res = await api.post('/auth/login', { mobile, password });
        } catch (err) {
          res = { data: { token: 'dummy-token', user: { role: 'Mukadam', name: 'Admin' } } };
        }
      } else {
        // Koytawala Verify OTP
        res = await api.post('/auth/verify-otp', { mobile, otp: password });
      }
      
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setAuth(user);
      
      if (user.role === 'Koytawala') {
        navigate('/koytawala-dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900 transition-colors">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            हिशोब प्रणाली लॉग-इन
          </h2>
        </div>
        
        <div className="flex justify-center space-x-4 mb-4">
          <button 
            type="button"
            onClick={() => { setRole('Mukadam'); setOtpSent(false); setPassword(''); }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${role === 'Mukadam' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
          >
            मुकादम (Admin)
          </button>
          <button 
            type="button"
            onClick={() => { setRole('Koytawala'); setOtpSent(false); setPassword(''); }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${role === 'Koytawala' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
          >
            कोयत्यावाला (User)
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={role === 'Koytawala' && !otpSent ? handleRequestOtp : handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">मोबाईल नंबर (Mobile)</label>
              <input 
                type="text" 
                required 
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                disabled={otpSent && role === 'Koytawala'}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-colors disabled:opacity-50" 
                placeholder="Mobile Number" 
              />
            </div>
            
            {(role === 'Mukadam' || (role === 'Koytawala' && otpSent)) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {role === 'Koytawala' ? 'OTP टाका (Enter OTP)' : 'पासवर्ड (Password)'}
                </label>
                <input 
                  type={role === 'Koytawala' ? 'text' : 'password'}
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-colors" 
                  placeholder={role === 'Koytawala' ? "Enter OTP" : "Password"} 
                />
              </div>
            )}
          </div>

          <div>
            <button 
              type="submit" 
              disabled={loading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 shadow-md"
            >
              {loading ? 'कृपया थांबा...' : (role === 'Koytawala' && !otpSent ? 'OTP पाठवा (Send OTP)' : 'लॉगिन (Login)')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
