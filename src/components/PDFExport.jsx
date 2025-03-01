import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  PDFViewer,
  Image 
} from '@react-pdf/renderer';

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#2563EB'
  },
  subheader: {
    fontSize: 18,
    marginBottom: 10,
    color: '#374151',
    borderBottom: '1 solid #E5E7EB',
    paddingBottom: 5
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5
  },
  label: {
    width: '60%',
    fontWeight: 'bold',
    color: '#4B5563'
  },
  value: {
    width: '40%',
    textAlign: 'right'
  },
  highlight: {
    backgroundColor: '#F3F4F6',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  },
  resultsContainer: {
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#EFF6FF',
    borderRadius: 5
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1E40AF'
  },
  resultsRow: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingBottom: 5,
    borderBottom: '1 solid #DBEAFE'
  },
  footer: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 30,
    color: '#6B7280'
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  logo: {
    width: 120,
    height: 40
  },
  date: {
    fontSize: 10,
    color: '#6B7280'
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 10
  },
  image: {
    width: '80%',
    height: 200,
    objectFit: 'contain'
  }
});

// Composant pour l'export PDF général
const GeneralROIDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.logoContainer}>
        <Text style={styles.date}>Généré le {new Date().toLocaleDateString()}</Text>
      </View>
      
      <View>
        <Text style={styles.header}>Rapport de Retour sur Investissement</Text>
        <Text style={{fontSize: 16, textAlign: 'center', marginBottom: 20, color: '#4B5563'}}>
          Automatisation Industrielle
        </Text>
      </View>
      
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Résultats de l'analyse</Text>
        
        <View style={styles.resultsRow}>
          <Text style={styles.label}>ROI global:</Text>
          <Text style={styles.value}>{data.roi.toFixed(2)}%</Text>
        </View>
        
        <View style={styles.resultsRow}>
          <Text style={styles.label}>Délai de récupération:</Text>
          <Text style={styles.value}>{data.delaiRecuperation.toFixed(2)} ans</Text>
        </View>
        
        <View style={styles.resultsRow}>
          <Text style={styles.label}>Valeur Actuelle Nette (VAN):</Text>
          <Text style={styles.value}>${data.van.toFixed(2)}</Text>
        </View>
        
        <View style={styles.resultsRow}>
          <Text style={styles.label}>Taux de Rendement Interne (TRI):</Text>
          <Text style={styles.value}>{data.tri.toFixed(2)}%</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.subheader}>Paramètres d'investissement</Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Coût total du système:</Text>
          <Text style={styles.value}>${data.coutSysteme + data.coutInstallation + data.coutIngenierie + data.coutFormation}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Subventions:</Text>
          <Text style={styles.value}>${data.subventions}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Durée de vie:</Text>
          <Text style={styles.value}>{data.dureeVie} ans</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Économies de main d'œuvre:</Text>
          <Text style={styles.value}>${data.coutMainOeuvre * data.nbEmployesRemplaces}/an</Text>
        </View>
      </View>
      
      <View style={styles.highlight}>
        <Text style={{fontWeight: 'bold', marginBottom: 5}}>Recommandation:</Text>
        <Text>
          {data.van > 0 && data.tri > data.tauxActualisation 
            ? "✓ Projet recommandé - Cet investissement en automatisation semble financièrement viable avec un ROI positif et un délai de récupération raisonnable."
            : "⚠ À réévaluer - Les paramètres actuels ne montrent pas un retour sur investissement optimal. Ajustez les variables ou envisagez des alternatives."}
        </Text>
      </View>
      
      <View style={styles.footer}>
        <Text>Ce rapport a été généré automatiquement par l'application Calculateurs ROI - Automatisation</Text>
        <Text>© {new Date().getFullYear()} - Tous droits réservés</Text>
      </View>
    </Page>
  </Document>
);

// Composant pour l'export PDF pour l'industrie des pâtes et papiers
const PapersROIDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.logoContainer}>
        <Text style={styles.date}>Généré le {new Date().toLocaleDateString()}</Text>
      </View>
      
      <View>
        <Text style={styles.header}>Rapport de Retour sur Investissement</Text>
        <Text style={{fontSize: 16, textAlign: 'center', marginBottom: 20, color: '#4B5563'}}>
          Désempilement et Débrochage de Ballots - Industrie des Pâtes et Papiers
        </Text>
      </View>
      
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Résultats de l'analyse</Text>
        
        <View style={styles.resultsRow}>
          <Text style={styles.label}>ROI global:</Text>
          <Text style={styles.value}>{data.roi.toFixed(2)}%</Text>
        </View>
        
        <View style={styles.resultsRow}>
          <Text style={styles.label}>Délai de récupération:</Text>
          <Text style={styles.value}>{data.delaiRecuperation.toFixed(2)} ans</Text>
        </View>
        
        <View style={styles.resultsRow}>
          <Text style={styles.label}>Valeur Actuelle Nette (VAN):</Text>
          <Text style={styles.value}>${data.van.toFixed(2)}</Text>
        </View>
        
        <View style={styles.resultsRow}>
          <Text style={styles.label}>Taux de Rendement Interne (TRI):</Text>
          <Text style={styles.value}>{data.tri.toFixed(2)}%</Text>
        </View>
        
        <View style={styles.resultsRow}>
          <Text style={styles.label}>Capacité de traitement:</Text>
          <Text style={styles.value}>{data.capaciteTraitement} ballots/heure</Text>
        </View>
        
        <View style={styles.resultsRow}>
          <Text style={styles.label}>Tonnes CO2 économisées:</Text>
          <Text style={styles.value}>{data.economiesCO2.toFixed(0)} tonnes</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.subheader}>Améliorations par rapport au système manuel</Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Réduction du taux de rejet:</Text>
          <Text style={styles.value}>{(data.tauxRejetsManuel - data.tauxRejetsFils).toFixed(2)}%</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Réduction des déchets:</Text>
          <Text style={styles.value}>{data.reductionDechet}%</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Économie d'énergie:</Text>
          <Text style={styles.value}>{data.reductionEnergie}%</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Économie d'eau:</Text>
          <Text style={styles.value}>{data.reductionEau}%</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Augmentation de production:</Text>
          <Text style={styles.value}>{data.augmentationProduction}%</Text>
        </View>
      </View>
      
      <View style={styles.highlight}>
        <Text style={{fontWeight: 'bold', marginBottom: 5}}>Pourquoi automatiser:</Text>
        <Text style={{fontSize: 10, marginBottom: 3}}>• Sécurité: réduction des risques liés à la manipulation des fils métalliques</Text>
        <Text style={{fontSize: 10, marginBottom: 3}}>• Qualité: moins de fils dans le pulpeur = moins d'arrêts et meilleure pâte</Text>
        <Text style={{fontSize: 10, marginBottom: 3}}>• Production: capacité accrue et constante d'alimentation</Text>
        <Text style={{fontSize: 10, marginBottom: 3}}>• Économies: réduction de la main d'œuvre et des déchets</Text>
        <Text style={{fontSize: 10}}>• Environnement: moins de pertes et de consommation d'énergie</Text>
      </View>
      
      <View style={styles.footer}>
        <Text>Ce rapport a été généré automatiquement par l'application Calculateurs ROI - Automatisation</Text>
        <Text>© {new Date().getFullYear()} - Tous droits réservés</Text>
      </View>
    </Page>
  </Document>
);

// Composant principal d'export PDF avec viewer
const PDFExport = ({ type, data }) => (
  <PDFViewer style={{width: '100%', height: '600px'}}>
    {type === 'general' ? 
      <GeneralROIDocument data={data} /> : 
      <PapersROIDocument data={data} />
    }
  </PDFViewer>
);

// Fonction pour télécharger directement le PDF sans prévisualisation
// à implémenter si nécessaire

export default PDFExport;