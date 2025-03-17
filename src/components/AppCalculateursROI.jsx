import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';
import CalculateurGeneral from './calculateurs/general/CalculateurGeneral';
import CalculateurPatesPapiers from './CalculateurPatesPapiers';

/**
 * Composant principal qui intègre les calculateurs et la navigation
 */
const AppCalculateursROI = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow container mx-auto p-4 pb-20">
          <Routes>
            <Route path="/" element={
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Calculateurs ROI pour l'Automatisation Industrielle</h1>
                <p className="text-xl text-gray-600 mb-6">Évaluez la rentabilité de vos projets d'automatisation industrielle</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
                  <a 
                    href="/calculateurs/general" 
                    className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all border-t-4 border-blue-600"
                  >
                    <h2 className="text-2xl font-bold text-blue-800 mb-4">Calculateur Général</h2>
                    <p className="text-gray-600 mb-4">Pour tous types de projets d'automatisation industrielle.</p>
                    <div className="mt-4 text-blue-600 font-medium">Accéder au calculateur →</div>
                  </a>
                  
                  <a 
                    href="/calculateurs/pates-papiers" 
                    className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all border-t-4 border-green-600"
                  >
                    <h2 className="text-2xl font-bold text-green-800 mb-4">Pâtes et Papiers</h2>
                    <p className="text-gray-600 mb-4">Calculateur spécialisé pour l'industrie des pâtes et papiers.</p>
                    <div className="mt-4 text-green-600 font-medium">Accéder au calculateur →</div>
                  </a>
                </div>
              </div>
            } />
            <Route path="/calculateurs/general" element={<CalculateurGeneral />} />
            <Route path="/calculateurs/pates-papiers" element={<CalculateurPatesPapiers />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
};

export default AppCalculateursROI;