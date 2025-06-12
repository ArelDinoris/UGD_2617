"use client";
import { useState } from "react";
import { FaPen, FaTrash, FaUser, FaEnvelope, FaPhone, FaLock, FaKey } from "react-icons/fa";

export default function Settings() {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "Arel Dinoris",
    email: "ArelDinoris01@gmail.com",
    phone: "081111111111",
    currentPassword: "admin123",
    newPassword: "admin123",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name as keyof typeof formData]: value });
  };

  const handleEdit = () => setEditMode(true);
  
  const handleDelete = () => {
    setEditMode(false);
    console.log("Data deleted (simulasi)");
  };

  const formFields: Array<{
    label: string;
    name: keyof typeof formData;
    type: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { label: "Username", name: "username", type: "text", icon: FaUser },
    { label: "Email", name: "email", type: "email", icon: FaEnvelope },
    { label: "Nomor Telepon", name: "phone", type: "text", icon: FaPhone },
    { label: "Current Password", name: "currentPassword", type: "password", icon: FaLock },
    { label: "New Password", name: "newPassword", type: "password", icon: FaKey },
  ];

  return (
    <div className="bg-gradient-to-br from-[#303477] to-[#1d285c] p-6 rounded-3xl shadow-lg text-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Pengaturan Akun</h1>
        <p className="text-blue-200 text-lg">Kelola informasi akun Anda dengan mudah</p>
      </div>

      {/* Welcome Message */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
        <div className="text-white text-xl">
          <span className="text-blue-200">Hi</span> <span className="font-semibold text-white">Arel Dinoris</span>, 
          <span className="text-blue-200"> here are your account settings.</span>
        </div>
      </div>

      <div className="flex gap-8 max-w-6xl mx-auto">
        {/* Profile Image Card */}
        <div className="w-80">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-white text-lg font-semibold mb-4 text-center">Profile Picture</h3>
            <div className="w-full h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl overflow-hidden shadow-2xl">
              <img
                src="/team.png"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg">
              Change Picture
            </button>
          </div>
        </div>

        {/* Settings Form Card */}
        <div className="flex-1">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-2xl font-semibold mb-6">Account Information</h3>
            
            <div className="space-y-6">
              {formFields.map(({ label, name, type, icon: Icon }) => (
                <div key={name} className="group">
                  <label className="block text-blue-200 mb-2 font-medium flex items-center gap-2">
                    <Icon className="text-blue-300" />
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      readOnly={!editMode}
                      className={`w-full p-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300 ${
                        !editMode ? 'cursor-not-allowed opacity-75' : 'hover:bg-white/25'
                      }`}
                      placeholder={`Enter your ${label.toLowerCase()}`}
                    />
                    {type === 'password' && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Action Buttons */}
              <div className="pt-6 flex gap-4">
                <button
                  onClick={handleEdit}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-4 rounded-xl flex items-center justify-center gap-3 flex-1 shadow-xl transition duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  <FaPen className="text-lg" /> 
                  <span className="text-lg">Edit Profile</span>
                </button>
                
                <button
                  onClick={handleDelete}
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-xl flex items-center justify-center gap-3 flex-1 shadow-xl transition duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  <FaTrash className="text-lg" /> 
                  <span className="text-lg">Delete Account</span>
                </button>
              </div>

              {/* Status Indicator */}
              <div className="mt-6 p-4 bg-green-500/20 border border-green-400/30 rounded-xl">
                <div className="flex items-center gap-2 text-green-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-medium">Account Status: Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-400/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-indigo-400/10 rounded-full blur-xl"></div>
      </div>
    </div>
  );
}