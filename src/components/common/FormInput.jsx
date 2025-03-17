import React from 'react';

/**
 * Composant de champ de formulaire avec support de validation
 * @param {object} props - Props du composant
 * @returns {JSX.Element} - Composant React
 */
const FormInput = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  error,
  placeholder,
  required = false,
  disabled = false,
  min,
  max,
  step,
  helpText,
  className = '',
  labelClassName = '',
  inputClassName = '',
  unit,
  ...rest
}) => {
  const hasError = !!error;
  
  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label 
          htmlFor={name}
          className={`block text-sm font-medium mb-1 ${hasError ? 'text-red-600' : 'text-gray-700'} ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={`w-full p-2 border rounded ${
            hasError 
              ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
              : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
          } ${unit ? 'pr-10' : ''} ${disabled ? 'bg-gray-100' : 'bg-white'} ${inputClassName}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
          {...rest}
        />
        
        {unit && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-500">{unit}</span>
          </div>
        )}
      </div>
      
      {helpText && !hasError && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
      
      {hasError && (
        <p id={`${name}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
