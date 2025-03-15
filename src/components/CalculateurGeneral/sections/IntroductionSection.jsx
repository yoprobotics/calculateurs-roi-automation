import React from 'react';

/**
 * Section d'introduction du calculateur général
 */
const IntroductionSection = () => {
  return (
    <div className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
      <h3 className="text-xl font-bold text-blue-800 mb-2">Pourquoi investir dans l'automatisation?</h3>
      <p className="mb-2">
        L'automatisation industrielle permet d'améliorer la productivité, la qualité et la rentabilité 
        de vos opérations tout en réduisant les coûts opérationnels.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-white p-3 rounded shadow">
          <h4 className="font-bold text-blue-700">Productivité Accrue</h4>
          <p>Augmentation du volume de production et réduction des temps d'arrêt.</p>
        </div>
        <div className="bg-white p-3 rounded shadow">
          <h4 className="font-bold text-blue-700">Qualité Constante</h4>
          <p>Élimination des erreurs humaines et amélioration de la répétabilité des processus.</p>
        </div>
        <div className="bg-white p-3 rounded shadow">
          <h4 className="font-bold text-blue-700">Réduction des Coûts</h4>
          <p>Diminution des coûts de main d'œuvre et optimisation de la consommation d'énergie et de matières.</p>
        </div>
      </div>
    </div>
  );
};

export default IntroductionSection;
