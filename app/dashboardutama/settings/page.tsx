"use client";

import { useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEditMode(true);
  const handleDelete = () => {
    setEditMode(false);
    // Logika penghapusan atau reset bisa kamu tambahkan di sini
    console.log("Data deleted (simulasi)");
  };

  return (
    <div className="min-h-screen bg-[#292864] p-6">
      <div className="text-white text-xl mb-6">
        Hi Arel Dinoris, here are your account settings.
      </div>

      <div className="flex gap-6">
        {/* Profile Image */}
        <div className="w-64 h-80 bg-white rounded-lg overflow-hidden">
          <img
            src="/team.png"
            alt="Team"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Settings Form */}
        <div className="flex-1">
          <div className="space-y-4">
            {[
              { label: "Username", name: "username", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Nomor Telepon", name: "phone", type: "text" },
              { label: "Current Password", name: "currentPassword", type: "password" },
              { label: "New Password", name: "newPassword", type: "password" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block text-white mb-1">{label}:</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name as keyof typeof formData]}
                  onChange={handleChange}
                  readOnly={!editMode}
                  className="w-full p-2 rounded-md text-black"
                />
              </div>
            ))}

            <div className="pt-4 flex gap-4">
              <button
                onClick={handleEdit}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-md flex items-center justify-center gap-2 w-full shadow-md transition duration-300"
              >
                <FaPen /> Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-md flex items-center justify-center gap-2 w-full shadow-md transition duration-300"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
