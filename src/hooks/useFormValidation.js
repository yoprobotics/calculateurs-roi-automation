import { useState, useCallback } from 'react';
import { validerParametres } from '../utils/validators';

/**
 * Hook personnalisé pour la validation de formulaires
 * @param {Object} valuesInitiales - Valeurs initiales du formulaire
 * @param {Object} reglesValidation - Règles de validation (voir validators.js)
 * @returns {Object} - Objet contenant les valeurs, erreurs et fonctions utilitaires
 */
const useFormValidation = (valuesInitiales = {}, reglesValidation = {}) => {
  // État pour les valeurs du formulaire
  const [values, setValues] = useState(valuesInitiales);
  
  // État pour les erreurs de validation
  const [errors, setErrors] = useState({});
  
  // État pour suivre quels champs ont été touchés
  const [touched, setTouched] = useState({});
  
  // Fonction pour mettre à jour un champ individuel
  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    
    // Déterminer la valeur selon le type d'élément
    const fieldValue = type === 'checkbox' ? checked : value;
    
    // Mettre à jour les valeurs du formulaire
    setValues(prevValues => ({
      ...prevValues,
      [name]: fieldValue
    }));
    
    // Marquer le champ comme touché
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true
    }));
    
    // Valider seulement ce champ spécifique
    if (reglesValidation[name]) {
      const fieldErrors = validerParametres(
        { [name]: fieldValue },
        { [name]: reglesValidation[name] }
      );
      
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: fieldErrors[name] || null
      }));
    }
  }, [reglesValidation]);
  
  // Fonction pour mettre à jour plusieurs champs à la fois
  const setFieldValues = useCallback((newValues) => {
    setValues(prevValues => ({
      ...prevValues,
      ...newValues
    }));
    
    // Marquer ces champs comme touchés
    const newTouched = Object.keys(newValues).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    
    setTouched(prevTouched => ({
      ...prevTouched,
      ...newTouched
    }));
    
    // Valider les nouveaux champs
    if (Object.keys(reglesValidation).length > 0) {
      const newValuesToValidate = Object.keys(newValues)
        .filter(key => reglesValidation[key])
        .reduce((acc, key) => {
          acc[key] = newValues[key];
          return acc;
        }, {});
      
      const newRegles = Object.keys(newValuesToValidate).reduce((acc, key) => {
        acc[key] = reglesValidation[key];
        return acc;
      }, {});
      
      const fieldErrors = validerParametres(newValuesToValidate, newRegles);
      
      setErrors(prevErrors => ({
        ...prevErrors,
        ...fieldErrors
      }));
    }
  }, [reglesValidation]);
  
  // Fonction pour marquer un champ comme touché
  const handleBlur = useCallback((event) => {
    const { name } = event.target;
    
    // Marquer le champ comme touché
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true
    }));
    
    // Valider le champ lors de la perte de focus
    if (reglesValidation[name]) {
      const fieldErrors = validerParametres(
        { [name]: values[name] },
        { [name]: reglesValidation[name] }
      );
      
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: fieldErrors[name] || null
      }));
    }
  }, [reglesValidation, values]);
  
  // Fonction pour valider tout le formulaire
  const validateForm = useCallback(() => {
    const formErrors = validerParametres(values, reglesValidation);
    setErrors(formErrors);
    
    // Marquer tous les champs comme touchés
    const allTouched = Object.keys(reglesValidation).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    
    setTouched(prevTouched => ({
      ...prevTouched,
      ...allTouched
    }));
    
    return Object.keys(formErrors).length === 0; // Renvoie true si pas d'erreurs
  }, [values, reglesValidation]);
  
  // Fonction pour réinitialiser le formulaire
  const resetForm = useCallback((newValues = valuesInitiales) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
  }, [valuesInitiales]);
  
  // Déterminer si le formulaire est valide
  const isValid = Object.keys(errors).length === 0;
  
  // Renvoyer les valeurs et fonctions nécessaires
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValues,
    validateForm,
    resetForm,
    isValid
  };
};

export default useFormValidation;
