import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactUs = () => {
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSent(true);
  };

  return (
    <PageLayout>
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Contact Us</h1>
        <p className="text-gray-500 text-sm mt-1">We'd love to hear from you. Reach out to our team below.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Send a Message</h2>
          {isSent ? (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 flex items-center gap-3">
              <Send className="w-5 h-5" />
              <p className="font-medium">Message sent successfully! We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name</label>
                <input type="text" required className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input type="email" required className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
                <textarea required rows="4" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300" placeholder="How can we help?"></textarea>
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-opacity-80 text-white py-3 rounded-xl font-bold transition-all duration-300 shadow-md flex justify-center items-center gap-2 hover:scale-[1.02]">
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Email Us</h3>
              <p className="text-gray-500 text-sm mt-0.5">support@nutriapp.fake</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Call Us</h3>
              <p className="text-gray-500 text-sm mt-0.5">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Visit Us</h3>
              <p className="text-gray-500 text-sm mt-0.5">123 Health Street, Nutrition City, NY 10001</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
export default ContactUs;
