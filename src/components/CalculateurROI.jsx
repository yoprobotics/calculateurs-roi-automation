// Remplacement ciblé de la ligne 393 - commentaire et début du calcul TRI
// Calcul du TRI (approximation simplifiée)
let triApprox = 0;
for (let r = 1; r <= 100; r++) {
  let npv = -investissementInitial;
  for (let t = 0; t < fluxTresorerie.length; t++) {
    npv += fluxTresorerie[t].fluxAnnuel / Math.pow(1 + r / 100, t + 1);
  }
  if (npv <= 0) {
    triApprox = r - 1;
    break;
  }
}