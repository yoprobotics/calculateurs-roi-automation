import React from 'react';
import Tooltip from './Tooltip';

/**
 * Composant d'entrée de formulaire avec étiquette et description optionnelle
 * @param {Object} props - Propriétés du composant
 * @param {string} props.label - Étiquette du champ
 * @param {any} props.value - Valeur actuelle
 * @param {Function} props.onChange - Fonction appelée lors du changement de valeur
 * @param {string} [props.type='text'] - Type d'entrée (text, number, etc.)
 * @param {string} [props.placeholder=''] - Texte d'espace réservé
 * @param {string} [props.description=''] - Description ou aide pour le champ
 * @param {boolean} [props.readOnly=false] - Indique si le champ est en lecture seule
 * @param {number} [props.step=1] - Pas pour les entrées numériques
 * @returns {JSX.Element} - Champ de formulaire
 */
export const FormInput = ({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  placeholder = '', 
  description = '', 
  readOnly = false,
  step = 1
}) => {
  const handleChange = (e) => {
    const newValue = type === 'number' ? Number(e.target.value) : e.target.value;
    onChange(newValue);
  };

  return (
    <div className="mb-2">
      <label className="block text-sm font-medium mb-1 flex items-center">
        {label}
        {description && <Tooltip content={description} />}
      </label>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full p-2 border rounded ${readOnly ? 'bg-gray-100' : ''}`}
        readOnly={readOnly}
        step={type === 'number' ? step : undefined}
      />
      {!description && readOnly && (
        <p className="text-xs text-gray-500 mt-1">Ce paramètre est déterminé automatiquement.</p>
      )}
    </div>
  );
};

export default FormInput;