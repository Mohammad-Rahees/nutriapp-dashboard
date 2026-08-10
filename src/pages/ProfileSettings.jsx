import React, { useState, useEffect, useRef } from 'react';
import { Camera, Save, User, Activity, Target, Upload, CheckCircle2, AlertCircle, Trash2, MapPin, Phone, Calendar } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import ProfileFormSection from '../components/profile/ProfileFormSection';
import FormInput from '../components/profile/FormInput';
import useStore from '../store/useStore';

const genderOptions = ['Female', 'Male', 'Non-binary', 'Prefer not to say'];
const goalOptions = ['Lose Weight', 'Maintain Weight', 'Gain Muscle', 'Improve General Fitness'];
const activityOptions = ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Super Active'];

const ProfileSettings = () => {
  const { user, updateUserProfile } = useStore();
  const fileInputRef = useRef(null);

  // Form State initialized from logged-in MongoDB user
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    gender: 'Prefer not to say',
    dob: '',
    bio: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    height: '170',
    weight: '70',
    goal: 'Maintain Weight',
    activityLevel: 'Moderately Active',
    latitude: '',
    longitude: '',
  });

  const [avatarPreview, setAvatarPreview] = useState('');
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync form with user state when user object loads or updates
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || 'Prefer not to say',
        dob: user.dob || '',
        bio: user.bio || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        country: user.country || '',
        postalCode: user.postalCode || '',
        height: user.height !== undefined ? String(user.height) : '170',
        weight: user.weight !== undefined ? String(user.weight) : '70',
        goal: user.goal || 'Maintain Weight',
        activityLevel: user.activityLevel || 'Moderately Active',
        latitude: user.latitude ? String(user.latitude) : '',
        longitude: user.longitude ? String(user.longitude) : '',
      });
      setAvatarPreview(user.avatar || '');
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Functional File Picker for Profile Photo Upload
  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image format (JPG, JPEG, PNG, WEBP)
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setNotification({
        type: 'error',
        message: 'Unsupported image format. Please select a JPG, JPEG, PNG, or WEBP file.',
      });
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    // Validate file size (< 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setNotification({
        type: 'error',
        message: 'Image size exceeds 5MB limit. Please choose a smaller image file.',
      });
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    // Read file data URL for live preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setNotification({
        type: 'success',
        message: 'Photo selected! Click "Save Changes" to apply your new profile avatar.',
      });
      setTimeout(() => setNotification(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  // Remove profile photo
  const handleRemoveAvatar = () => {
    setAvatarPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setNotification({
      type: 'success',
      message: 'Profile photo removed. Click "Save Changes" to confirm.',
    });
    setTimeout(() => setNotification(null), 3000);
  };

  // Browser Geolocation API Handler
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setNotification({ type: 'error', message: 'Geolocation is not supported by your browser.' });
      return;
    }
    setNotification({ type: 'success', message: 'Fetching GPS location...' });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          latitude: String(latitude),
          longitude: String(longitude),
        }));
        setNotification({
          type: 'success',
          message: `GPS Coordinates captured! (Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)})`,
        });
        setTimeout(() => setNotification(null), 4000);
      },
      (err) => {
        setNotification({
          type: 'error',
          message: 'Unable to retrieve location. Please check browser permissions.',
        });
        setTimeout(() => setNotification(null), 4000);
      }
    );
  };

  // Save changes to MongoDB Users collection
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    const profilePayload = {
      ...formData,
      avatar: avatarPreview,
      height: Number(formData.height) || 170,
      weight: Number(formData.weight) || 70,
      latitude: formData.latitude ? Number(formData.latitude) : null,
      longitude: formData.longitude ? Number(formData.longitude) : null,
    };

    const res = await updateUserProfile(profilePayload);
    setIsSubmitting(false);

    if (res.success) {
      setNotification({
        type: 'success',
        message: 'Profile settings updated successfully!',
      });
      setTimeout(() => setNotification(null), 4000);
    } else {
      setNotification({
        type: 'error',
        message: res.message || 'Failed to update profile settings.',
      });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    formData.name || user?.name || 'User'
  )}&background=9333ea&color=ffffff&size=150`;

  return (
    <PageLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Profile Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your personal information, contact details, and fitness goals.</p>
        </div>

        <button 
          onClick={handleSave}
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 w-full sm:w-auto hover:scale-[1.02] disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Profile Completion Status Banner */}
      {!user?.profileCompleted && (
        <div className="mb-6 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-orange-500/10 border border-amber-300/80 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-md">
              !
            </div>
            <div>
              <h3 className="font-extrabold text-amber-900 text-base">Incomplete Delivery Profile</h3>
              <p className="text-xs text-amber-800 font-medium mt-0.5">
                Please complete your Full Name, Phone Number, and Delivery Address below to enable order placement.
              </p>
            </div>
          </div>
          <span className="text-xs font-black bg-amber-500 text-white px-4 py-2 rounded-xl text-center self-start sm:self-auto shadow-xs uppercase tracking-wider">
            Required for Delivery
          </span>
        </div>
      )}

      {user?.profileCompleted && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-3xl p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-extrabold text-emerald-900">
              Delivery Profile Status: Complete & Verified ✅
            </span>
          </div>
          <span className="text-xs text-emerald-700 font-bold">Ready to Order</span>
        </div>
      )}
      {notification && (
        <div
          className={`mb-6 p-4 rounded-2xl flex items-center gap-3 shadow-md animate-in fade-in slide-in-from-top-3 ${
            notification.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-rose-50 border border-rose-200 text-rose-900'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span className="font-semibold text-sm">{notification.message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* LEFT COLUMN: Personal Info & Address */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information & Avatar */}
          <ProfileFormSection title="Personal Information" icon={User} iconColorClass="bg-purple-50 text-purple-600 shadow-sm">
            {/* Functional Profile Photo Upload */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-gray-100">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-purple-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                  <img 
                    src={avatarPreview || defaultAvatar} 
                    alt="Profile Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full shadow-md text-white hover:bg-purple-700 transition-colors"
                  title="Upload profile photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center sm:text-left">
                <h3 className="font-bold text-gray-800">Profile Photo</h3>
                <p className="text-xs text-gray-500 mt-1 mb-3">Supported formats: JPG, JPEG, PNG, WEBP. Max size: 5MB.</p>
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg, image/jpg, image/png, image/webp"
                    onChange={handleAvatarFileChange}
                    className="hidden"
                  />
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    className="px-4 py-2 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold rounded-xl hover:bg-purple-100 transition-colors flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Change Photo
                  </button>
                  {avatarPreview && (
                    <button 
                      type="button" 
                      onClick={handleRemoveAvatar}
                      className="px-4 py-2 text-rose-600 bg-rose-50 border border-rose-200 text-xs font-bold hover:bg-rose-100 rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Form Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <FormInput 
                  label="Full Name *" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder={user?.name || "Not provided"} 
                />
              </div>
              <div>
                <FormInput 
                  label="Username" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange} 
                  placeholder={user?.username || "Not provided"} 
                />
              </div>
              <div>
                <FormInput 
                  type="email" 
                  label="Email Address *" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder={user?.email || "Not provided"} 
                />
              </div>
              <div>
                <FormInput 
                  type="text" 
                  label="Phone Number" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="e.g. +91 98765 43210" 
                />
              </div>
              <div>
                <FormInput 
                  type="select" 
                  label="Gender" 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange} 
                  options={genderOptions} 
                />
              </div>
              <div>
                <FormInput 
                  type="date" 
                  label="Date of Birth" 
                  name="dob" 
                  value={formData.dob} 
                  onChange={handleChange} 
                />
              </div>
              <div className="sm:col-span-2">
                <FormInput 
                  type="textarea" 
                  label="Bio / Summary" 
                  name="bio" 
                  value={formData.bio} 
                  onChange={handleChange} 
                  rows={3} 
                  placeholder="Write a short summary about yourself..." 
                />
              </div>
            </div>
          </ProfileFormSection>

          {/* Address Information Section */}
          <ProfileFormSection title="Shipping & Billing Address" icon={MapPin} iconColorClass="bg-blue-50 text-blue-600">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <FormInput 
                  label="Street Address" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  placeholder="e.g. 123 Main Street, Suite 4B" 
                />
              </div>
              <div>
                <FormInput 
                  label="City" 
                  name="city" 
                  value={formData.city} 
                  onChange={handleChange} 
                  placeholder="e.g. Mumbai / New York" 
                />
              </div>
              <div>
                <FormInput 
                  label="State / Province" 
                  name="state" 
                  value={formData.state} 
                  onChange={handleChange} 
                  placeholder="e.g. Maharashtra / California" 
                />
              </div>
              <div>
                <FormInput 
                  label="Country" 
                  name="country" 
                  value={formData.country} 
                  onChange={handleChange} 
                  placeholder="e.g. India / United States" 
                />
              </div>
              <div>
                <FormInput 
                  label="Postal Code" 
                  name="postalCode" 
                  value={formData.postalCode} 
                  onChange={handleChange} 
                  placeholder="e.g. 400001" 
                />
              </div>

              <div className="sm:col-span-2 pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-purple-600" />
                    GPS Delivery Location
                  </span>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {formData.latitude && formData.longitude 
                      ? `Coordinates set: Lat ${Number(formData.latitude).toFixed(4)}, Lng ${Number(formData.longitude).toFixed(4)}`
                      : 'No coordinates set. Click to capture current GPS location.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <MapPin className="w-4 h-4 text-purple-600" />
                  Set Current Location
                </button>
              </div>
            </div>
          </ProfileFormSection>
        </div>

        {/* RIGHT COLUMN: Measurements & Goals */}
        <div className="space-y-6">
          <ProfileFormSection title="Physical Measurements" icon={Activity} iconColorClass="bg-emerald-50 text-emerald-600">
            <div className="grid grid-cols-2 gap-4">
              <FormInput type="number" label="Height (cm)" name="height" value={formData.height} onChange={handleChange} placeholder="170" />
              <FormInput type="number" label="Weight (kg)" name="weight" value={formData.weight} onChange={handleChange} placeholder="70" />
            </div>
          </ProfileFormSection>

          <ProfileFormSection title="Fitness Goals" icon={Target} iconColorClass="bg-orange-50 text-orange-600">
            <div className="space-y-5">
              <FormInput type="select" label="Primary Goal" name="goal" value={formData.goal} onChange={handleChange} options={goalOptions} />
              <FormInput type="select" label="Activity Level" name="activityLevel" value={formData.activityLevel} onChange={handleChange} options={activityOptions} />
            </div>
          </ProfileFormSection>
        </div>
      </form>
    </PageLayout>
  );
};

export default ProfileSettings;
