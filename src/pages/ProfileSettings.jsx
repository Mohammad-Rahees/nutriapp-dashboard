import React, { useState } from 'react';
import { Camera, Save, User, Activity, Target } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import ProfileFormSection from '../components/profile/ProfileFormSection';
import FormInput from '../components/profile/FormInput';
import { genderOptions, goalOptions, activityOptions } from '../data/mockData';

const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    gender: 'Female',
    age: '28',
    bio: 'Fitness enthusiast and foodie. Always looking for new healthy recipes and workout routines.',
    height: '168',
    weight: '62',
    waist: '68',
    chest: '88',
    goal: 'Maintain Weight',
    activityLevel: 'Lightly Active'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log('Saved data:', formData);
  };



  return (
    <PageLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Profile Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your personal information and fitness goals.</p>
        </div>
        
        <button 
          onClick={handleSave}
          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-opacity-80 text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 w-full sm:w-auto hover:scale-[1.02]"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* LEFT COLUMN: Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          <ProfileFormSection title="Personal Information" icon={User} iconColorClass="bg-purple-50 text-purple-600 shadow-sm">
            {/* Profile Photo Upload */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-gray-100">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-sm overflow-hidden">
                  <img 
                    src="https://ui-avatars.com/api/?name=Jane+Doe&background=eff6ff&color=4f46e5&size=150" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button type="button" className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 text-gray-600 hover:text-indigo-600 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-semibold text-gray-800">Profile Photo</h3>
                <p className="text-xs text-gray-500 mt-1 mb-3">Suggested format: JPG, PNG. Max size: 2MB.</p>
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <button type="button" className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">Change Photo</button>
                  <button type="button" className="px-4 py-2 text-red-600 text-sm font-medium hover:bg-red-50 rounded-lg transition-colors">Remove</button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2 lg:col-span-1">
                <FormInput label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="Jane Doe" />
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <FormInput type="email" label="Email Address" name="email" value={formData.email} onChange={handleChange} placeholder="jane@example.com" />
              </div>
              <FormInput type="select" label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={genderOptions} />
              <FormInput type="number" label="Age" name="age" value={formData.age} onChange={handleChange} placeholder="e.g. 28" />
              <FormInput type="textarea" label="Bio" name="bio" value={formData.bio} onChange={handleChange} rows={4} placeholder="Write a short summary about yourself..." />
            </div>
          </ProfileFormSection>
        </div>

        {/* RIGHT COLUMN: Measurements & Goals */}
        <div className="space-y-6">
          <ProfileFormSection title="Measurements" icon={Activity} iconColorClass="bg-emerald-50 text-emerald-600">
            <div className="grid grid-cols-2 gap-4">
              <FormInput type="number" label="Height (cm)" name="height" value={formData.height} onChange={handleChange} />
              <FormInput type="number" label="Weight (kg)" name="weight" value={formData.weight} onChange={handleChange} />
              <FormInput type="number" label="Waist (cm)" name="waist" value={formData.waist} onChange={handleChange} />
              <FormInput type="number" label="Chest (cm)" name="chest" value={formData.chest} onChange={handleChange} />
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
