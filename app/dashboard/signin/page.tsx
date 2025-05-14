'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaEye, FaEyeSlash, FaRedo } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface LoginFormData {
  email: string;
  password: string;
  captchaInput: string;
}

interface ErrorObject {
  email?: string;
  password?: string;
  captcha?: string;
}

const VALID_EMAIL = 'admin123';
const VALID_PASSWORD = '12345';

const generateRandomCaptcha = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
};

const backgroundImages = [
  { src: "/headphone.png", className: "top-10 left-10 rotate-12" },
  { src: "/airbuds.png", className: "bottom-10 left-10 -rotate-12" },
  { src: "/earphone.png", className: "top-10 right-10 -rotate-12" },
  { src: "/airpods.png", className: "bottom-10 right-10 rotate-12" },
];

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    captchaInput: ''
  });
  const [errors, setErrors] = useState<ErrorObject>({});
  const [captcha, setCaptcha] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(3);
  const [showPassword, setShowPassword] = useState(false);

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateRandomCaptcha());
  }, []);

  useEffect(() => {
    refreshCaptcha();
    setErrors({});
  }, [refreshCaptcha]);

  const validateForm = (): ErrorObject => {
    const newErrors: ErrorObject = {};
    if (!formData.email.trim()) newErrors.email = 'Email tidak boleh kosong';
    else if (formData.email !== VALID_EMAIL) newErrors.email = 'Email tidak sesuai';

    if (!formData.password.trim()) newErrors.password = 'Password tidak boleh kosong';
    else if (formData.password !== VALID_PASSWORD) newErrors.password = 'Password tidak sesuai';

    if (formData.captchaInput !== captcha) newErrors.captcha = 'Captcha tidak valid';

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (loginAttempts > 0) {
        setLoginAttempts(prev => Math.max(0, prev - 1));
        if (loginAttempts - 1 > 0) {
          toast.error(`Login Gagal! Sisa kesempatan: ${loginAttempts - 1}`, { theme: 'dark', position: 'top-right' });
        } else {
          toast.error('Kesempatan login habis!', { theme: 'dark', position: 'top-right' });
        }
      }
      return;
    }

    toast.success('Login Berhasil!', { theme: 'dark', position: 'top-right' });
    router.push('/dashboardutama');
  };

  const resetAttempts = () => {
    setLoginAttempts(3);
    toast.success('Kesempatan login berhasil direset', { theme: 'dark', position: 'top-right' });
  };

  return (
    <main className="flex min-h-screen flex-col p-6  relative">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        {backgroundImages.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={`Background ${index + 1}`}
            className={`absolute ${image.className} w-30 h-30 object-contain`}
          />
        ))}
      </div>

      {/* Welcome Text */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-white text-lg text-center font-semibold">
        <p>Welcome to Bazeus, Have a nice day.</p>
      </div>

      {/* Login Form */}
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="w-full max-w-md bg-[#303477] border border-white border-opacity-20 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-center text-white mb-6">Sign In Admin</h1>

          <div className="flex flex-col items-center mb-4">
            <p className="text-sm text-gray-200">Sisa Kesempatan: {loginAttempts}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-200">Username</label>
              <input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:outline-none transition-colors"
                placeholder="Masukan username"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-200">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:outline-none transition-colors"
                  placeholder="Masukan password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? <FaEyeSlash size={24} /> : <FaEye size={24} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <span className="text-gray-200">Ingat saya</span>
              </label>
              <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-800 font-medium">
                Forgot password?
              </Link>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-200">Captcha:</span>
                <span className="font-mono text-lg font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded">{captcha}</span>
                <FaRedo className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer" onClick={refreshCaptcha} />
              </div>
              <input
                type="text"
                name="captchaInput"
                value={formData.captchaInput}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:outline-none transition-colors ${errors.captcha ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`}
                placeholder="Masukan captcha"
              />
              {errors.captcha && <p className="text-red-600 text-sm italic mt-1">{errors.captcha}</p>}
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 px-4 rounded-lg bg-blue-700 text-white text-sm font-semibold transition-all
                ${loginAttempts > 0 ? 'hover:bg-[#232aa0]' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
              disabled={loginAttempts === 0}
            >
              Sign In
            </button>

            <button
              type="button"
              className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors ${loginAttempts === 0 ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
              onClick={resetAttempts}
              disabled={loginAttempts !== 0}
            >
              Reset Kesempatan
            </button>

            <p className="mt-6 text-center text-sm text-gray-200">
              Tidak punya akun?{' '}
              <Link href="/dashboard/signup" className="text-blue-600 hover:text-blue-800 font-semibold">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}