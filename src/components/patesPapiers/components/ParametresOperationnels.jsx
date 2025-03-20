import React from 'react';
import PropTypes from 'prop-types';

/**
 * Composant affichant les paramètres opérationnels clés
 * Permet une comparaison visuelle entre système actuel et automatisé
 * @param {Object} props - Les propriétés du composant
 * @returns {JSX.Element} Composant de paramètres opérationnels
 */
const ParametresOperationnels = ({ resultats, parametresGeneraux, parametresSystemeActuel, parametresSystemeAutomatise }) => {
  const { parametresOperationnels } = resultats;
  const { 
    tempsCycleActuel, 
    tempsCycleAutomatise, 
    gainProductivite, 
    heuresOperationAnnuelles,
    coutParBallotActuel,
    coutParBallotAutomatise,
    economieParBallot
  } = parametresOperationnels;

  // Ballots par jour
  const ballotsParJourActuel = parametresSystemeActuel.capacite * parametresGeneraux.heuresOperationParJour;
  const ballotsParJourAutomatise = parametresSystemeAutomatise.capaciteTraitement * parametresGeneraux.heuresOperationParJour;
  const gainBallotsParJour = ((ballotsParJourAutomatise - ballotsParJourActuel) / ballotsParJourActuel) * 100;

  // Tonnes par jour
  const tonnesParJourActuel = (ballotsParJourActuel * parametresGeneraux.tonnageAnnuel) / 
                             (parametresGeneraux.joursOperationParAn * ballotsParJourActuel);
  const tonnesParJourAutomatise = (ballotsParJourAutomatise * parametresGeneraux.tonnageAnnuel) / 
                                 (parametresGeneraux.joursOperationParAn * ballotsParJourActuel);
  const gainTonnesParJour = ((tonnesParJourAutomatise - tonnesParJourActuel) / tonnesParJourActuel) * 100;

  // Consommation énergétique par ballot
  const energieParBallotActuel = parametresSystemeActuel.energie / 
                               (parametresSystemeActuel.capacite * heuresOperationAnnuelles);
  const energieParBallotAutomatise = parametresSystemeAutomatise.coutEnergie / 
                                  (parametresSystemeAutomatise.capaciteTraitement * heuresOperationAnnuelles);
  const reductionEnergieParBallot = ((energieParBallotActuel - energieParBallotAutomatise) / energieParBallotActuel) * 100;

  // Productivité par employé
  const productiviteParEmployeActuel = ballotsParJourActuel / parametresSystemeActuel.nombreEmployes;
  const productiviteParEmployeAutomatise = ballotsParJourAutomatise / 
                                        (parametresSystemeActuel.nombreEmployes - parametresSystemeAutomatise.nbEmployesRemplaces);
  const gainProductiviteParEmploye = ((productiviteParEmployeAutomatise - productiviteParEmployeActuel) / productiviteParEmployeActuel) * 100;

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Paramètres opérationnels clés</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Temps de cycle */}
        <div className="bg-white p-3 rounded shadow-sm">
          <h4 className="text-sm font-medium text-gray-600">Temps de cycle</h4>
          <div className="flex justify-between mt-2">
            <div>
              <span className="text-xs text-gray-500">Actuel</span>
              <p className="text-lg font-bold">{tempsCycleActuel.toFixed(1)} s</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Automatisé</span>
              <p className="text-lg font-bold text-green-600">{tempsCycleAutomatise.toFixed(1)} s</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="font-medium text-green-600">
              -{(100 - (tempsCycleAutomatise / tempsCycleActuel * 100)).toFixed(1)}%
            </span> de temps par ballot
          </div>
        </div>
        
        {/* Ballots par jour */}
        <div className="bg-white p-3 rounded shadow-sm">
          <h4 className="text-sm font-medium text-gray-600">Ballots par jour</h4>
          <div className="flex justify-between mt-2">
            <div>
              <span className="text-xs text-gray-500">Actuel</span>
              <p className="text-lg font-bold">
                {ballotsParJourActuel.toFixed(0)}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Automatisé</span>
              <p className="text-lg font-bold text-green-600">
                {ballotsParJourAutomatise.toFixed(0)}
              </p>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="font-medium text-green-600">
              +{gainBallotsParJour.toFixed(1)}%
            </span> de production
          </div>
        </div>
        
        {/* Coût par ballot */}
        <div className="bg-white p-3 rounded shadow-sm">
          <h4 className="text-sm font-medium text-gray-600">Coût par ballot</h4>
          <div className="flex justify-between mt-2">
            <div>
              <span className="text-xs text-gray-500">Actuel</span>
              <p className="text-lg font-bold">{coutParBallotActuel.toFixed(2)} $</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Automatisé</span>
              <p className="text-lg font-bold text-green-600">{coutParBallotAutomatise.toFixed(2)} $</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Économie de <span className="font-medium text-green-600">{economieParBallot.toFixed(2)} $</span> par ballot
          </div>
        </div>
        
        {/* Tonnes par jour */}
        <div className="bg-white p-3 rounded shadow-sm">
          <h4 className="text-sm font-medium text-gray-600">Tonnes par jour</h4>
          <div className="flex justify-between mt-2">
            <div>
              <span className="text-xs text-gray-500">Actuel</span>
              <p className="text-lg font-bold">{tonnesParJourActuel.toFixed(1)}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Automatisé</span>
              <p className="text-lg font-bold text-green-600">{tonnesParJourAutomatise.toFixed(1)}</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="font-medium text-green-600">
              +{gainTonnesParJour.toFixed(1)}%
            </span> de capacité
          </div>
        </div>
        
        {/* Énergie par ballot */}
        <div className="bg-white p-3 rounded shadow-sm">
          <h4 className="text-sm font-medium text-gray-600">Énergie par ballot</h4>
          <div className="flex justify-between mt-2">
            <div>
              <span className="text-xs text-gray-500">Actuel</span>
              <p className="text-lg font-bold">{energieParBallotActuel.toFixed(3)} $</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Automatisé</span>
              <p className="text-lg font-bold text-green-600">{energieParBallotAutomatise.toFixed(3)} $</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="font-medium text-green-600">
              -{reductionEnergieParBallot.toFixed(1)}%
            </span> d'énergie
          </div>
        </div>
        
        {/* Productivité par employé */}
        <div className="bg-white p-3 rounded shadow-sm">
          <h4 className="text-sm font-medium text-gray-600">Ballots par employé/jour</h4>
          <div className="flex justify-between mt-2">
            <div>
              <span className="text-xs text-gray-500">Actuel</span>
              <p className="text-lg font-bold">{productiviteParEmployeActuel.toFixed(0)}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Automatisé</span>
              <p className="text-lg font-bold text-green-600">{productiviteParEmployeAutomatise.toFixed(0)}</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="font-medium text-green-600">
              +{gainProductiviteParEmploye.toFixed(1)}%
            </span> de productivité
          </div>
        </div>
      </div>
    </div>
  );
};

ParametresOperationnels.propTypes = {
  resultats: PropTypes.object.isRequired,
  parametresGeneraux: PropTypes.object.isRequired,
  parametresSystemeActuel: PropTypes.object.isRequired,
  parametresSystemeAutomatise: PropTypes.object.isRequired
};

export default ParametresOperationnels;