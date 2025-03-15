import { useState, useCallback } from 'react';

/**
 * Hook personnalisé pour la validation des formulaires
 * @param {Object} initialValues - Valeurs initiales du formulaire
 * @param {Function} validateFn - Fonction de validation
 * @returns {Object} - Fonctions et état pour la validation
 */
export const useFormValidation = (initialValues, validateFn) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Vérifie si le formulaire est valide
   * @returns {boolean} - Validité du formulaire
   */
  const isValid = useCallback(() => {
    const newErrors = validateFn(values);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validateFn]);

  /**
   * Gère le changement de valeur d'un champ
   * @param {string} name - Nom du champ
   * @param {any} value - Nouvelle valeur
   */
  const handleChange = useCallback((name, value) => {
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
    
    // Si le champ a été touché, revalider
    if (touched[name]) {
      const fieldError = validateFn({ [name]: value })[name];
      
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: fieldError
      }));
    }
  }, [touched, validateFn]);

  /**
   * Marque un champ comme touché
   * @param {string} name - Nom du champ
   */
  const handleBlur = useCallback((name) => {
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true
    }));
    
    // Valider le champ lors de la perte de focus
    const fieldError = validateFn({ [name]: values[name] })[name];
    
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: fieldError
    }));
  }, [values, validateFn]);

  /**
   * Gère la soumission du formulaire
   * @param {Function} onSubmit - Fonction appelée après validation
   */
  const handleSubmit = useCallback((onSubmit) => {
    setIsSubmitting(true);
    
    if (isValid()) {
      onSubmit(values);
    }
    
    setIsSubmitting(false);
  }, [values, isValid]);

  /**
   * Réinitialise le formulaire
   * @param {Object} newValues - Nouvelles valeurs initiales (optionnel)
   */
  const resetForm = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    isValid,
    setValues
  };
};

/**
 * Fonctions de validation prédéfinies pour les paramètres communs
 */
export const validationRules = {
  /**
   * Validation des paramètres généraux
   * @param {Object} values - Valeurs à valider
   * @returns {Object} - Erreurs de validation
   */
  parametresGeneraux: (values) => {
    const errors = {};
    
    if (!values.tauxInflation && values.tauxInflation !== 0) {
      errors.tauxInflation = 'Le taux d\'inflation est requis';
    } else if (values.tauxInflation < 0 || values.tauxInflation > 20) {
      errors.tauxInflation = 'Le taux d\'inflation doit être entre 0 et 20%';
    }
    
    if (!values.tauxActualisation && values.tauxActualisation !== 0) {
      errors.tauxActualisation = 'Le taux d\'actualisation est requis';
    } else if (values.tauxActualisation < 0 || values.tauxActualisation > 30) {
      errors.tauxActualisation = 'Le taux d\'actualisation doit être entre 0 et 30%';
    }
    
    if (!values.margeBrute && values.margeBrute !== 0) {
      errors.margeBrute = 'La marge brute est requise';
    } else if (values.margeBrute < 0) {
      errors.margeBrute = 'La marge brute ne peut pas être négative';
    }
    
    if (!values.heuresOperationParJour) {
      errors.heuresOperationParJour = 'Les heures d\'opération par jour sont requises';
    } else if (values.heuresOperationParJour < 0 || values.heuresOperationParJour > 24) {
      errors.heuresOperationParJour = 'Les heures d\'opération doivent être entre 0 et 24';
    }
    
    if (!values.joursOperationParAn) {
      errors.joursOperationParAn = 'Les jours d\'opération par an sont requis';
    } else if (values.joursOperationParAn < 0 || values.joursOperationParAn > 365) {
      errors.joursOperationParAn = 'Les jours d\'opération doivent être entre 0 et 365';
    }
    
    return errors;
  },
  
  /**
   * Validation des paramètres du système actuel
   * @param {Object} values - Valeurs à valider
   * @returns {Object} - Erreurs de validation
   */
  systemeActuel: (values) => {
    const errors = {};
    
    if (!values.capacite && values.capacite !== 0) {
      errors.capacite = 'La capacité est requise';
    } else if (values.capacite < 0) {
      errors.capacite = 'La capacité ne peut pas être négative';
    }
    
    if (!values.nombreEmployes && values.nombreEmployes !== 0) {
      errors.nombreEmployes = 'Le nombre d\'employés est requis';
    } else if (values.nombreEmployes < 0) {
      errors.nombreEmployes = 'Le nombre d\'employés ne peut pas être négatif';
    }
    
    if (!values.coutMaintenance && values.coutMaintenance !== 0) {
      errors.coutMaintenance = 'Le coût de maintenance est requis';
    } else if (values.coutMaintenance < 0) {
      errors.coutMaintenance = 'Le coût de maintenance ne peut pas être négatif';
    }
    
    if (!values.perteProduction && values.perteProduction !== 0) {
      errors.perteProduction = 'Le taux de perte de production est requis';
    } else if (values.perteProduction < 0 || values.perteProduction > 100) {
      errors.perteProduction = 'Le taux de perte doit être entre 0 et 100%';
    }
    
    if (!values.tauxRejets && values.tauxRejets !== 0) {
      errors.tauxRejets = 'Le taux de rejets est requis';
    } else if (values.tauxRejets < 0 || values.tauxRejets > 100) {
      errors.tauxRejets = 'Le taux de rejets doit être entre 0 et 100%';
    }
    
    if (!values.frequenceAccident && values.frequenceAccident !== 0) {
      errors.frequenceAccident = 'La fréquence d\'accidents est requise';
    } else if (values.frequenceAccident < 0) {
      errors.frequenceAccident = 'La fréquence d\'accidents ne peut pas être négative';
    }
    
    if (!values.coutMoyenAccident && values.coutMoyenAccident !== 0) {
      errors.coutMoyenAccident = 'Le coût moyen par accident est requis';
    } else if (values.coutMoyenAccident < 0) {
      errors.coutMoyenAccident = 'Le coût moyen par accident ne peut pas être négatif';
    }
    
    return errors;
  },
  
  /**
   * Validation des paramètres du système automatisé
   * @param {Object} values - Valeurs à valider
   * @returns {Object} - Erreurs de validation
   */
  systemeAutomatise: (values) => {
    const errors = {};
    
    if (!values.coutSysteme && values.coutSysteme !== 0) {
      errors.coutSysteme = 'Le coût du système est requis';
    } else if (values.coutSysteme < 0) {
      errors.coutSysteme = 'Le coût du système ne peut pas être négatif';
    }
    
    if (!values.dureeVie) {
      errors.dureeVie = 'La durée de vie est requise';
    } else if (values.dureeVie < 1 || values.dureeVie > 30) {
      errors.dureeVie = 'La durée de vie doit être entre 1 et 30 ans';
    }
    
    if (!values.capaciteTraitement && values.capaciteTraitement !== 0) {
      errors.capaciteTraitement = 'La capacité de traitement est requise';
    } else if (values.capaciteTraitement < 0) {
      errors.capaciteTraitement = 'La capacité de traitement ne peut pas être négative';
    }
    
    if (!values.nbEmployesRemplaces && values.nbEmployesRemplaces !== 0) {
      errors.nbEmployesRemplaces = 'Le nombre d\'employés remplacés est requis';
    } else if (values.nbEmployesRemplaces < 0) {
      errors.nbEmployesRemplaces = 'Le nombre d\'employés remplacés ne peut pas être négatif';
    }
    
    if (!values.tauxRejets && values.tauxRejets !== 0) {
      errors.tauxRejets = 'Le taux de rejets est requis';
    } else if (values.tauxRejets < 0 || values.tauxRejets > 100) {
      errors.tauxRejets = 'Le taux de rejets doit être entre 0 et 100%';
    }
    
    if (!values.reductionAccidents && values.reductionAccidents !== 0) {
      errors.reductionAccidents = 'Le taux de réduction des accidents est requis';
    } else if (values.reductionAccidents < 0 || values.reductionAccidents > 100) {
      errors.reductionAccidents = 'Le taux de réduction doit être entre 0 et 100%';
    }
    
    return errors;
  }
};

export default useFormValidation;
