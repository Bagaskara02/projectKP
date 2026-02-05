import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Attempting login with:', { email, password }); // Debug log

    try {
      const result = await login(email, password);
      console.log('Login result:', result); // Debug log
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Login gagal');
      }
    } catch (err) {
      console.error('Login error:', err); // Debug log
      setError('Terjadi kesalahan koneksi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#e3f2fd] to-[#bbdefb] items-center justify-center p-12">
        <div className="max-w-lg">
          <img 
            src="https://img.freepik.com/free-vector/business-team-putting-together-jigsaw-puzzle-isolated-flat-vector-illustration-cartoon-partners-working-connection-teamwork-partnership-cooperation-concept_74855-9814.jpg" 
            alt="Illustration"
            className="w-full h-auto"
          />
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-[#4e73df]">SIMONEV-KIP</h2>
            <p className="text-gray-600 mt-2">Sistem Informasi Monitoring & Evaluasi Kinerja Instansi Pemerintah</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-[#4e73df]">SIMONEV-KIP</h1>
            <p className="text-sm text-gray-500">Sistem Informasi Monitoring & Evaluasi Kinerja Instansi Pemerintah</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign In</h2>
          <p className="text-gray-500 mb-8">
            Gunakan <span className="text-[#4e73df] font-medium">User</span> dan{' '}
            <span className="text-[#4e73df] font-medium">Password</span> yang benar untuk login
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e73df] focus:border-transparent outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Password Input with Eye Toggle */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e73df] focus:border-transparent outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4e73df] hover:bg-[#2e59d9] text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Memproses...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 font-medium mb-2">Demo Credentials:</p>
            <p className="text-xs text-gray-600">Email: <span className="font-mono">admin@pn-yogyakarta.go.id</span></p>
            <p className="text-xs text-gray-600">Password: <span className="font-mono">admin123</span></p>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-[#4e73df] hover:underline">
              ← Kembali ke Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
