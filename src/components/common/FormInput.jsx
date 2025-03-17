import React from 'react';

/**
 * Composant de champ de formulaire réutilisable
 * @param {Object} props - Propriétés React
 * @returns {JSX.Element} - Champ de formulaire
 */
const FormInput = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  min,
  max,
  step,
  placeholder,
  helper,
  error,
  touched,
  required = false,
  disabled = false,
  className = '',
  labelClassName = '',
  inputClassName = '',
  helperClassName = '',
  errorClassName = ''
}) => {
  // Gestion des types spécifiques
  const isNumberType = type === 'number';
  
  // Classes CSS pour l'état de l'input
  const inputStateClass = error && touched 
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={id || name} 
          className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        id={id || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        min={isNumberType ? min : undefined}
        max={isNumberType ? max : undefined}
        step={isNumberType ? step : undefined}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${inputStateClass} ${disabled ? 'bg-gray-100 text-gray-500' : ''} ${inputClassName}`}
        required={required}
      />
      
      {helper && !error && (
        <p className={`mt-1 text-xs text-gray-500 ${helperClassName}`}>
          {helper}
        </p>
      )}
      
      {error && touched && (
        <p className={`mt-1 text-xs text-red-500 ${errorClassName}`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
