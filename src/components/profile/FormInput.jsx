import React from 'react';

const FormInput = ({ label, type = "text", name, value, onChange, placeholder, options, rows }) => {
  const inputClass = "w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-400 block p-3 outline-none transition-all duration-300 shadow-inner";
  const labelClass = "block mb-1.5 text-sm font-semibold text-gray-700";

  if (type === "select") {
    return (
      <div>
        <label className={labelClass}>{label}</label>
        <select name={name} value={value} onChange={onChange} className={inputClass}>
          {options && options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className={rows ? `sm:col-span-2` : ''}>
        <label className={labelClass}>{label}</label>
        <textarea 
          name={name}
          value={value}
          onChange={onChange}
          rows={rows || 4}
          className={`${inputClass} resize-none`} 
          placeholder={placeholder}
        />
      </div>
    );
  }

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input 
        type={type} 
        name={name}
        value={value}
        onChange={onChange}
        className={inputClass} 
        placeholder={placeholder}
      />
    </div>
  );
};

export default FormInput;
