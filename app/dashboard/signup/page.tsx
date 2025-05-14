'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash, FaRedo } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Link from 'next/link';
import SocialAuth from '@/public/components/SocialAuth';

type RegisterFormData = {
  username: string;
  email: string;
  nomorTelp: string;
  password: string;
  confirmPassword: string;
  captcha: string;
};

const RegisterPage = () => {
  const router = useRouter();
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<RegisterFormData>();

  const password = watch('password', '');

  useEffect(() => {
    const strength = Math.min(
      (password.length > 7 ? 25 : 0) +
      (/[A-Z]/.test(password) ? 25 : 0) +
      (/[0-9]/.test(password) ? 25 : 0) +
      (/[^A-Za-z0-9]/.test(password) ? 25 : 0)
    );
    setPasswordStrength(strength);
  }, [password]);

  const generateCaptcha = useCallback(() => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
  }, []);

  useEffect(() => {
    setCaptcha(generateCaptcha());
    reset();
  }, [generateCaptcha, reset]);

  const onSubmit = (data: RegisterFormData) => {
    if (captchaInput !== captcha) {
      toast.error('Captcha tidak cocok!', { theme: 'dark' });
      return;
    }
    toast.success('Register Berhasil!', { theme: 'dark' });
    router.push('/home');
  };

  const backgroundImages = [
    { src: "/headphone.png", className: "top-10 left-10 rotate-12" },
    { src: "/airbuds.png", className: "bottom-10 left-10 -rotate-12" },
    { src: "/earphone.png", className: "top-10 right-10 -rotate-12" },
    { src: "/airpods.png", className: "bottom-10 right-10 rotate-12" },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 relative">
      {/* Background Images */}
      {backgroundImages.map((image, index) => (
        <img
          key={index}
          src={image.src}
          alt={`Background ${index + 1}`}
          className={`absolute ${image.className} w-30 h-30 object-contain`}
        />
      ))}

      {/* Welcome Text - di luar card */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-white text-lg text-center font-semibold">
        <p>Welcome to Bazeus, Have a nice day.</p>
      </div>

      {/* Card Form */}
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="w-full max-w-md bg-[#303477] border border-white border-opacity-10 rounded-lg p-6 transform transition-all hover:scale-105 shadow-xl">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Sign Up Admin</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white mb-1">
                Username <span className="text-white text-xs">(3–8 karakter)</span>
              </label>
              <input
                id="username"
                {...register('username', {
                  required: 'Username wajib diisi',
                  minLength: { value: 3, message: 'Minimal 3 karakter' },
                  maxLength: { value: 8, message: 'Maksimal 8 karakter' },
                })}
                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition
                ${errors.username ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                placeholder="Masukkan username"
              />
              {errors.username && <p className="text-red-600 text-xs mt-1">{errors.username.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1">Email</label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email wajib diisi',
                  pattern: {
                    value: /^[\w.-]+@[\w.-]+\.(com|net|co)$/,
                    message: 'Format email tidak valid',
                  },
                })}
                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition
                ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                placeholder="Masukkan email"
              />
              {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Nomor Telepon */}
            <div>
              <label htmlFor="nomorTelp" className="block text-sm font-medium text-white mb-1">Nomor Telepon</label>
              <input
                id="nomorTelp"
                {...register('nomorTelp', {
                  required: 'Nomor telepon wajib diisi',
                  minLength: { value: 10, message: 'Minimal 10 karakter' },
                  pattern: { value: /^[0-9]+$/, message: 'Hanya angka yang diperbolehkan' },
                })}
                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition
                ${errors.nomorTelp ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                placeholder="Masukkan nomor telepon"
              />
              {errors.nomorTelp && <p className="text-red-600 text-xs mt-1">{errors.nomorTelp.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-1">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register('password', {
                    required: 'Password wajib diisi',
                    minLength: { value: 8, message: 'Minimal 8 karakter' }
                  })}
                  className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition
                  ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                  placeholder="Masukkan password"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-1">Konfirmasi Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register('confirmPassword', {
                    required: 'Wajib konfirmasi password',
                    validate: value => value === password || 'Konfirmasi tidak cocok',
                  })}
                  className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition
                  ${errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                  placeholder="Masukkan ulang password"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            {/* Captcha */}
            <div>
              <label htmlFor="captcha" className="block text-sm font-medium text-white mb-1">Captcha</label>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded">{captcha}</span>
                <FaRedo className="text-blue-600 hover:text-blue-800 cursor-pointer" onClick={() => setCaptcha(generateCaptcha())} />
              </div>
              <input
                id="captcha"
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="w-full mt-2 px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Masukkan captcha"
              />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition shadow-lg">
              Sign Up
            </button>

            <div className="text-center text-sm text-white mt-4">
              Sudah punya akun? <Link href="/dashboard/signin" className="text-blue-600 font-medium hover:underline">Sign In</Link>
            </div>

            <div className="mt-6">
              <SocialAuth />
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;
