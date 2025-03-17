import { useState, useCallback } from 'react';
import { validateNumericField } from '../utils/validators';

/**
 * Hook personnalisé pour la gestion de la validation des formulaires
 * @param {Object} initialValues - Valeurs initiales du formulaire
 * @param {Object} validationRules - Règles de validation par champ
 * @returns {Object} - Fonctions et états pour gérer la validation
 */
const useFormValidation = (initialValues = {}, validationRules = {}) => {
  // État pour les valeurs du formulaire
  const [values, setValues] = useState(initialValues);
  
  // État pour les erreurs de validation
  const [errors, setErrors] = useState({});
  
  // État pour indiquer si le formulaire a été soumis
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Validation d'un champ unique
  const validateField = useCallback((name, value, rules = {}) => {
    // Si pas de règles pour ce champ, on considère qu'il est valide
    if (!validationRules[name] && !rules) {
      return { isValid: true, errorMessage: '' };
    }

    // Utilisation des règles spécifiques si fournies, sinon les règles globales
    const fieldRules = rules || validationRules[name] || {};
    
    // Validation numérique par défaut
    return validateNumericField(value, {
      ...fieldRules,
      fieldName: fieldRules.fieldName || name
    });
  }, [validationRules]);
  
  // Validation de tous les champs du formulaire
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;
    
    // Validation de chaque champ
    Object.keys(values).forEach(fieldName => {
      const value = values[fieldName];
      const validation = validateField(fieldName, value);
      
      if (!validation.isValid) {
        newErrors[fieldName] = validation.errorMessage;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  }, [values, validateField]);
  
  // Gestion du changement de valeur d'un champ
  const handleChange = useCallback((event) => {
    const { name, value, type } = event.target;
    
    // Conversion selon le type de champ
    let processedValue = value;
    if (type === 'number') {
      processedValue = value === '' ? '' : Number(value);
    }
    
    setValues(prevValues => ({
      ...prevValues,
      [name]: processedValue
    }));
    
    // Si le formulaire a été soumis, on valide au fur et à mesure
    if (isSubmitted) {
      const validation = validateField(name, processedValue);
      
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: validation.isValid ? '' : validation.errorMessage
      }));
    }
  }, [isSubmitted, validateField]);
  
  // Version simplifiée du handleChange pour utilisation directe avec les setters
  const setValue = useCallback((name, value) => {
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
    
    // Si le formulaire a été soumis, on valide au fur et à mesure
    if (isSubmitted) {
      const validation = validateField(name, value);
      
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: validation.isValid ? '' : validation.errorMessage
      }));
    }
  }, [isSubmitted, validateField]);
  
  // Gestion de la soumission du formulaire
  const handleSubmit = useCallback((onSubmit) => (event) => {
    if (event) {
      event.preventDefault();
    }
    
    setIsSubmitted(true);
    const isValid = validateForm();
    
    if (isValid && onSubmit) {
      onSubmit(values);
    }
  }, [validateForm, values]);
  
  // Réinitialisation du formulaire
  const resetForm = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setIsSubmitted(false);
  }, [initialValues]);
  
  return {
    values,
    errors,
    setValues,
    setValue,
    handleChange,
    handleSubmit,
    validateForm,
    validateField,
    resetForm,
    isValid: Object.keys(errors).length === 0
  };
};

export default useFormValidation;
