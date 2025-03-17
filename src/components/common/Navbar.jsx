import React, { useState } from 'react';

/**
 * Composant de barre de navigation
 * @returns {JSX.Element} - Barre de navigation
 */
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const refreshApp = () => {
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo et nom - Actualise l'application au clic */}
          <div className="flex items-center cursor-pointer" onClick={refreshApp}>
            {/* Logo YoProbotics SVG simplifié */}
            <svg 
              width="120" 
              height="40" 
              viewBox="0 0 1200 275" 
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-auto mr-3"
            >
              {/* Logo YO en jaune */}
              <g fill="#ffde59">
                <path d="M127.95 146.45 C128.30 146.40 129.60 146.37 131.84 146.37 C134.09 146.37 136.83 146.35 140.07 146.32 C143.32 146.29 146.61 146.27 149.95 146.27 C153.27 146.27 156.52 146.29 159.7 146.32 C162.88 146.35 165.6 146.37 167.85 146.37 C170.1 146.37 171.4 146.40 171.76 146.45 C172.57 146.56 173.15 146.83 173.51 147.24 C173.75 147.54 173.87 147.68 173.87 147.68 C173.87 147.73 173.89 148.19 173.95 149.04 C174.01 149.88 174.07 151.39 174.12 153.56 C174.18 155.71 174.21 158.77 174.21 162.74 C174.27 167.42 174.31 171.28 174.31 174.32 C174.31 177.35 174.27 179.33 174.21 180.27 C174.15 181.26 174.12 181.92 174.12 182.24 C174.12 182.56 174.09 182.77 174.03 182.87 C173.97 182.95 173.89 183.14 173.78 183.43 C173.48 184.01 173.1 184.39 172.64 184.57 C172.17 184.62 170.61 184.66 167.98 184.69 C165.35 184.73 161.21 184.74 155.54 184.74 C151.75 184.81 148.77 184.82 146.6 184.79 C144.45 184.76 142.84 184.76 141.79 184.79 C140.74 184.82 139.98 184.87 139.51 184.93 C139.04 184.98 138.66 185.1 138.37 185.27 C137.73 185.57 137.24 186.03 136.88 186.66 C136.65 187.13 136.51 187.65 136.45 188.21 C136.38 188.76 136.35 189.82 136.35 191.37 C136.35 192.91 136.35 195.37 136.35 198.76 C136.3 201.8 136.27 204.12 136.27 205.72 C136.27 207.33 136.24 208.47 136.18 209.15 C136.12 209.82 136.04 210.24 135.96 210.41 C135.88 210.59 135.77 210.77 135.65 210.94 C135.31 211.41 134.72 211.7 133.9 211.82 C133.67 211.87 133.07 211.9 132.1 211.9 C131.14 211.9 130.21 211.9 129.31 211.9 C128.4 211.9 127.86 211.87 127.68 211.82 C126.58 211.64 125.85 211.11 125.49 210.24 C125.49 210.13 125.48 209.67 125.45 208.88 C125.41 208.09 125.38 206.63 125.35 204.51 C125.33 202.37 125.32 199.29 125.32 195.26 C125.32 191.22 125.32 185.91 125.32 179.3 C125.32 172.36 125.32 166.83 125.32 162.71 C125.32 158.58 125.33 155.49 125.35 153.41 C125.38 151.34 125.41 149.97 125.45 149.3 C125.48 148.63 125.49 148.26 125.49 148.19 C125.67 147.61 125.92 147.2 126.23 146.98 C126.55 146.74 127.13 146.56 127.95 146.45 Z M 161.34 158.27 C160.92 158.04 160.46 157.9 159.96 157.85 C 159.47 157.79 158.48 157.77 156.99 157.8 C 155.5 157.83 153.09 157.84 149.76 157.84 C 146.49 157.84 144.11 157.83 142.62 157.8 C 141.13 157.77 140.12 157.79 139.59 157.85 C 139.06 157.9 138.6 158.05 138.2 158.27 C 137.61 158.63 137.17 159.13 136.88 159.77 C 136.59 160.41 136.41 161.11 136.35 161.87 C 136.24 162.57 136.16 163.54 136.13 164.77 C 136.1 165.99 136.13 167.17 136.21 168.32 C 136.31 169.45 136.44 170.28 136.62 170.8 C 137.03 171.92 137.73 172.65 138.73 172.99 C 139.2 173.17 140.44 173.25 142.45 173.23 C 144.46 173.19 146.97 173.15 149.95 173.09 C 153.33 173.09 155.78 173.1 157.29 173.13 C 158.81 173.16 159.82 173.15 160.32 173.09 C 160.82 173.02 161.28 172.82 161.68 172.47 C 162.09 172.12 162.44 171.68 162.73 171.16 C 162.97 170.58 163.1 169.98 163.12 169.36 C 163.15 168.75 163.16 167.48 163.16 165.55 C 163.16 163.63 163.15 162.34 163.12 161.69 C 163.1 161.05 162.97 160.47 162.73 159.94 C 162.44 159.25 161.97 158.69 161.34 158.27 Z"/>
              </g>
              
              {/* Texte ROBOTICS */}
              <g transform="translate(145, 0)">
                <path fill="none" stroke="#000" strokeWidth="3" d="M290 120 L290 175 C290 185 287 194 282 203 C277 211 270 218 262 223 C253 228 244 230 234 230 L178 230 L234 285 L290 285 L290 340 L223 340 C215 340 208 337 203 332 L100 230 L68 230 L68 340 L12 340 L12 63 L234 63 C244 63 253 65 262 70 C270 75 277 82 282 90 C287 99 290 108 290 120 Z M234 120 L68 120 L68 175 L234 175 Z"/>
                
                <path fill="none" stroke="#000" strokeWidth="3" d="M540 340 L373 340 C363 340 354 337 345 332 C337 328 330 321 325 312 C320 304 318 294 318 284 L318 118 C318 107 320 98 325 90 C330 81 337 75 345 70 C354 65 363 63 373 63 L540 63 C550 63 559 65 568 70 C576 75 583 81 588 90 C593 98 595 107 595 118 L595 284 C595 294 593 304 588 312 C583 321 576 327 568 332 C559 337 550 340 540 340 Z M373 118 L373 284 L540 284 L540 118 Z"/>
                
                <path fill="none" stroke="#000" strokeWidth="3" d="M900 118 L900 175 C900 183 897 189 892 195 C886 200 880 203 872 203 C880 203 886 206 892 211 C897 217 900 223 900 230 L900 284 C900 294 898 304 893 312 C888 321 881 327 873 332 C864 337 855 340 845 340 L623 340 L623 63 L845 63 C855 63 864 65 873 70 C881 75 888 82 893 90 C898 99 900 108 900 118 Z M845 118 L678 118 L678 175 L845 175 Z M678 284 L845 284 L845 230 L678 230 Z"/>
                
                <path fill="none" stroke="#000" strokeWidth="3" d="M1150 340 L983 340 C973 340 964 337 956 332 C947 328 940 321 935 312 C930 304 928 294 928 284 L928 118 C928 107 930 98 935 90 C940 81 947 75 956 70 C964 65 973 63 983 63 L1150 63 L1150 118 L983 118 L983 284 L1150 284 Z"/>
                
                <path fill="none" stroke="#000" strokeWidth="3" d="M1510 63 L1510 118 L1400 118 L1400 340 L1344 340 L1344 118 L1233 118 L1233 63 Z"/>
                
                <path fill="none" stroke="#000" strokeWidth="3" d="M1816 340 L1538 340 L1538 284 L1650 284 L1650 118 L1538 118 L1538 63 L1816 63 L1816 118 L1705 118 L1705 284 L1816 284 Z"/>
                
                <path fill="none" stroke="#000" strokeWidth="3" d="M2120 340 L1900 340 C1890 340 1880 337 1872 332 C1863 328 1856 321 1851 312 C1846 304 1844 294 1844 284 L1844 118 C1844 107 1846 98 1851 90 C1856 81 1863 75 1872 70 C1880 65 1890 63 1900 63 L2120 63 L2120 118 L1900 118 L1900 284 L2120 284 Z"/>
                
                <path fill="none" stroke="#000" strokeWidth="3" d="M2427 63 L2427 118 L2205 118 L2205 175 L2372 175 C2382 175 2391 177 2400 182 C2408 187 2415 193 2420 202 C2425 210 2427 219 2427 230 L2427 284 C2427 294 2425 304 2420 312 C2415 321 2408 327 2400 332 C2391 337 2382 340 2372 340 L2150 340 L2150 284 L2372 284 L2372 230 L2205 230 C2195 230 2186 228 2177 223 C2169 218 2162 211 2157 203 C2152 194 2150 185 2150 175 L2150 118 C2150 107 2152 98 2157 90 C2162 81 2169 75 2177 70 C2186 65 2195 63 2205 63 Z"/>
              </g>
            </svg>
            <span className="text-xl font-semibold text-gray-800">Calculateurs ROI</span>
          </div>
          
          {/* Navigation principale - desktop */}
          <div className="hidden md:flex items-center">
            <a 
              href="https://www.yoprobotics.com/formulaire1735622456560" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Réserver une consultation gratuite
            </a>
          </div>
          
          {/* Bouton menu hamburger - mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Ouvrir le menu</span>
              {/* Icône hamburger */}
              <svg
                className={`${menuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icône de fermeture (X) */}
              <svg
                className={`${menuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Menu mobile */}
      <div className={`${menuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            href="https://www.yoprobotics.com/formulaire1735622456560"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
          >
            Réserver une consultation gratuite
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;