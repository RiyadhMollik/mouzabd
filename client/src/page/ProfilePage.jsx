import React, { useContext, useEffect, useState } from 'react';
import { Edit, X, Save, Loader2 } from 'lucide-react';
import { AuthContext } from '../provider/AuthProvider';
import { getBaseUrl } from '../utils/baseurls';

export default function ProfilePage() {
  const { userdata } = useContext(AuthContext);
  const user = userdata?.data?.[0] || {};
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: user.fullname || '',
    name: user.name || '',
    email: user.email || '',
    phone_number: user.phone_number || '',
    descriptions: user.descriptions || '',
    profile_picture: user.profile_picture || ''
  });

  // Handle late-loading userdata by syncing to formData
  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || '',
        name: user.name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        descriptions: user.descriptions || '',
        profile_picture: user.profile_picture || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token =
      localStorage.getItem('token') ||
      localStorage.getItem('authToken') ||
      userdata?.token;
console.log(token)
    if (!token) {
      alert("No token found. Please login again.");
      setIsLoading(false);
      return;
    }

    const userId = user?.id;
    if (!userId) {
      alert("User ID not found.");
      setIsLoading(false);
      return;
    }

    console.log("Updating user ID:", userId);
    console.log("Using token:", token);
    console.log("Form Data:", formData);

    try {
      const response = await fetch(`${getBaseUrl()}/users/${userId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}` // Change to Bearer if needed
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedData = await response.json();
        setIsModalOpen(false);
        alert('Profile updated successfully!');
      } else if (response.status === 401) {
        alert('Unauthorized. Your session might have expired. Please login again.');
      } else if (response.status === 403) {
        alert('You do not have permission to update this profile.');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update profile (${response.status})`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Failed to update profile. ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => {
    setFormData({
      fullname: user.fullname || '',
      name: user.name || '',
      email: user.email || '',
      phone_number: user.phone_number || '',
      descriptions: user.descriptions || '',
      profile_picture: user.profile_picture || ''
    });
    setIsModalOpen(true);
  };

  if (!user || !user.email) {
    return (
      <div className="text-center mt-10 text-gray-600">
        Loading profile information...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Profile Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {user.profile_picture ? (
              <img src={user.profile_picture} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-2xl font-semibold">{user.email?.[0]}</span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-medium text-gray-900 mb-1">{user.fullname}</h2>
              <p className="text-gray-600 break-all">{user.email}</p>
            </div>

            <button onClick={openModal} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
              <Edit size={16} />
              <span className="hidden sm:inline">Edit</span>
            </button>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            <button onClick={openModal} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
              <Edit size={16} />
              <span className="hidden sm:inline">Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="text-gray-900 font-medium">{user.name}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
              <div className="text-gray-900 font-medium break-all">{user.email}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <div className="text-gray-400">{user.phone_number}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <div className="text-gray-400">{user.descriptions}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-80 backdrop-blur-sm">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture URL</label>
                <input
                  type="url"
                  name="profile_picture"
                  value={formData.profile_picture}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  name="descriptions"
                  value={formData.descriptions}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
