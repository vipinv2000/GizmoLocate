import { useContext, useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, Camera } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Axios } from '../../utils/Axiox';

import { AppContext } from '../../context/AppContext.jsx';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setIsAdmin } = useContext(AppContext);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.username.trim()) return toast.error('username is required');

    if (!formData.password) return toast.error('Password is required');
    if (formData.password.length < 6)
      return toast.error('Password must be at least 6 characters');

    try {
      setLoading(true);
      const { data } = await Axios.post('/admin/login', formData);
      if (data.AdminName) {
        setIsAdmin(true)
      }

      //   navigate('/admin/home');
      toast.success('Successfully logged in !');
      console.log('User Data:', data);
      console.log('User ffData:', formData);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-2xl font-bold text-gray-700"
        >
          Login In
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium">Username</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 size-5" />
              <input
                type="text"
                className="w-full h-12 border border-gray-300 rounded-lg pl-10 pr-3 focus:ring-2 focus:ring-blue-500 transition"
                placeholder="you@example.com"
                value={formData.username}
                onChange={e =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 size-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full h-12 border border-gray-300 rounded-lg pl-10 pr-10 focus:ring-2 focus:ring-blue-500 transition"
                placeholder="••••••••"
                value={formData.password}
                onChange={e =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 text-white font-semibold rounded-lg bg-blue-500 hover:bg-blue-600 transition"
          >
            {loading ? 'logging In...' : 'Log In'}
          </button>

          {/* Sign In Link */}
          <p className="text-center text-gray-600 text-sm mt-4">
            Dont't have an account?{' '}
            <Link
              to="/user/signUp"
              className="text-blue-500 font-semibold hover:underline"
            >
              signUp
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
