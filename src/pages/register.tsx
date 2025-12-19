// src/pages/register.tsx
import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye, FiEyeOff, FiCheck, FiX, FiUser, FiMail, FiLock, FiUsers, FiArrowRight } from 'react-icons/fi';
import useAuth from '../hooks/useAuth';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '', // Confirm password field
    role: 'customer' as 'customer' | 'artisan', // Default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const { username, email, password, password2, role } = formData;

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: '', requirements: [] };

    const requirements = [
      { met: password.length >= 8, text: 'At least 8 characters' },
      { met: /[a-z]/.test(password), text: 'One lowercase letter' },
      { met: /[A-Z]/.test(password), text: 'One uppercase letter' },
      { met: /\d/.test(password), text: 'One number' },
      { met: /[!@#$%^&*(),.?":{}|<>]/.test(password), text: 'One special character' }
    ];

    const score = requirements.filter(req => req.met).length;
    
    let label = '';
    let color = '';
    
    if (score === 0) {
      label = '';
      color = '';
    } else if (score <= 2) {
      label = 'Weak';
      color = 'text-red-600';
    } else if (score <= 3) {
      label = 'Fair';
      color = 'text-yellow-600';
    } else if (score <= 4) {
      label = 'Good';
      color = 'text-blue-600';
    } else {
      label = 'Strong';
      color = 'text-green-600';
    }

    return { score, label, color, requirements };
  }, [password]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== password2) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      await register(username, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        <div className="absolute bottom-40 right-40 w-80 h-80 bg-gradient-to-br from-green-400 to-teal-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-6000"></div>
        
        {/* Floating craft elements */}
        <div className="absolute top-16 right-24 w-5 h-5 bg-cyan-400 rounded-full opacity-60 animate-float"></div>
        <div className="absolute bottom-24 left-20 w-3 h-3 bg-pink-400 rounded-full opacity-50 animate-float animation-delay-2000"></div>
        <div className="absolute top-1/3 right-12 w-4 h-4 bg-yellow-400 rounded-full opacity-70 animate-float animation-delay-4000"></div>
        <div className="absolute bottom-1/3 left-8 w-2 h-2 bg-green-400 rounded-full opacity-60 animate-float animation-delay-6000"></div>
      </div>

      <div className="w-full max-w-lg space-y-8 relative z-10">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Link to='/' className="flex items-center group">
              <div className="relative">
                <img 
                  src="/images/logo3.png" 
                  alt="CraftConnect Logo" 
                  className="w-12 h-12 mr-4 object-contain filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                CraftConnect
              </h2>
            </Link>
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white via-cyan-200 to-pink-200 bg-clip-text text-transparent mb-2">
            Join the Community
          </h1>
          <p className="text-cyan-200 text-lg">
            Start your creative journey today
          </p>
          <p className="mt-4 text-center text-sm text-cyan-300">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-pink-400 hover:text-pink-300 transition-colors duration-200 underline decoration-pink-400/30 hover:decoration-pink-300">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Main Form Card */}
        <div className="glass-card rounded-2xl shadow-2xl p-8 relative overflow-hidden animate-glow">
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 rounded-2xl shimmer-effect"></div>
          
          <div className="relative z-10">
            <form className="space-y-5" onSubmit={onSubmit}>
              {/* Username Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90" htmlFor="username">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-cyan-300 group-focus-within:text-pink-400 transition-colors duration-200" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={onChange}
                    autoComplete="username"
                    className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-cyan-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:bg-white/15 input-glow"
                    placeholder="Choose your username"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90" htmlFor="email">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-cyan-300 group-focus-within:text-pink-400 transition-colors duration-200" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    autoComplete="email"
                    className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-cyan-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:bg-white/15 input-glow"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90" htmlFor="password">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-cyan-300 group-focus-within:text-pink-400 transition-colors duration-200" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    autoComplete="new-password"
                    className="block w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-cyan-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:bg-white/15 input-glow"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-cyan-300 hover:text-pink-400 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-3 bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/80">Password strength:</span>
                      <span className={`text-sm font-medium ${passwordStrength.color.replace('text-', 'text-').replace('-600', '-400')}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    
                    {/* Strength Bar */}
                    <div className="w-full bg-white/20 rounded-full h-2 mb-3">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.score <= 2 ? 'bg-gradient-to-r from-red-400 to-red-500' :
                          passwordStrength.score <= 3 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                          passwordStrength.score <= 4 ? 'bg-gradient-to-r from-blue-400 to-cyan-500' : 'bg-gradient-to-r from-green-400 to-emerald-500'
                        }`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      ></div>
                    </div>
                    
                    {/* Requirements List */}
                    <div className="grid grid-cols-1 gap-1">
                      {passwordStrength.requirements.map((req, index) => (
                        <div key={index} className="flex items-center text-xs">
                          {req.met ? (
                            <FiCheck className="h-3 w-3 text-green-400 mr-2 flex-shrink-0" />
                          ) : (
                            <FiX className="h-3 w-3 text-white/40 mr-2 flex-shrink-0" />
                          )}
                          <span className={req.met ? 'text-green-300' : 'text-white/60'}>
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90" htmlFor="password2">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-cyan-300 group-focus-within:text-pink-400 transition-colors duration-200" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="password2"
                    name="password2"
                    value={password2}
                    onChange={onChange}
                    autoComplete="new-password"
                    className="block w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-cyan-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:bg-white/15 input-glow"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-cyan-300 hover:text-pink-400 transition-colors duration-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {password2 && (
                  <div className="mt-2 flex items-center text-sm bg-white/5 border border-white/10 rounded-lg p-2 backdrop-blur-sm">
                    {password === password2 ? (
                      <>
                        <FiCheck className="h-4 w-4 text-green-400 mr-2" />
                        <span className="text-green-300">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <FiX className="h-4 w-4 text-red-400 mr-2" />
                        <span className="text-red-300">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90" htmlFor="role">
                  Join as
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUsers className="h-5 w-5 text-cyan-300 group-focus-within:text-pink-400 transition-colors duration-200" />
                  </div>
                  <select
                    id="role"
                    name="role"
                    value={role}
                    onChange={onChange}
                    className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:bg-white/15 appearance-none cursor-pointer input-glow"
                  >
                    <option value="customer" className="bg-gray-800 text-white">Customer (Looking to hire artisans)</option>
                    <option value="artisan" className="bg-gray-800 text-white">Artisan (Showcase your crafts)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-200 text-sm text-center backdrop-blur-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-cyan-600 to-pink-600 hover:from-cyan-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] btn-gradient-hover"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <FiArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;