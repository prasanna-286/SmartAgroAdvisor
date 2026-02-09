// DOM Elements
const homeView = document.getElementById('home-view');
const scanView = document.getElementById('scan-view');
const resultsView = document.getElementById('results-view');
const loadingOverlay = document.getElementById('loading');
const scanBtn = document.getElementById('scan-btn');
const backHomeBtn = document.getElementById('back-home');
const newScanBtn = document.getElementById('new-scan-btn');
const saveReportBtn = document.getElementById('save-report');
const shareWhatsappBtn = document.getElementById('share-whatsapp');
const offlineIndicator = document.createElement('div');
offlineIndicator.id = 'offline-indicator';
offlineIndicator.textContent = '⚠️ Offline Mode: Results will save when online';
document.body.appendChild(offlineIndicator);

// View Navigation
function showView(viewElement) {
  [homeView, scanView, resultsView].forEach(v => v.classList.add('hidden'));
  viewElement.classList.remove('hidden');
  window.scrollTo(0, 0);
}

scanBtn.addEventListener('click', () => showView(scanView));
backHomeBtn.addEventListener('click', () => showView(homeView));
newScanBtn.addEventListener('click', () => {
  resetScan();
  showView(scanView);
});

// Mock AI Analysis (Replace with real API call in production)
function analyzeImage(imageFile) {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Mock disease database (replace with real model predictions)
      const diseases = [
        {
          name: "Late Blight",
          confidence: "92%",
          treatment: "Spray copper-based fungicide (2g/L water) every 7 days. Remove infected leaves immediately.",
          prevention: ["Avoid overhead irrigation", "Space plants for better airflow", "Apply neem oil weekly as preventive measure"],
          cropTip: "Tomato Specific: Remove lower leaves to reduce humidity near soil.",
          pesticideWarning: "Chlorothalonil banned in your region. Use copper oxychloride instead."
        },
        {
          name: "Yellow Rust",
          confidence: "87%",
          treatment: "Apply triadimefon (0.05%) at first sign of disease. Repeat after 15 days.",
          prevention: ["Use resistant wheat varieties", "Avoid excessive nitrogen fertilizer", "Destroy volunteer wheat plants"],
          cropTip: "Wheat Specific: Rotate crops with non-cereal plants every 2 years.",
          pesticideWarning: "Avoid propiconazole during grain filling stage."
        },
        {
          name: "Bacterial Spot",
          confidence: "78%",
          treatment: "Spray streptomycin sulfate (100 ppm) or copper hydroxide. Remove severely infected plants.",
          prevention: ["Use disease-free seeds", "Avoid working in fields when wet", "Practice 2-year crop rotation"],
          cropTip: "Pepper Specific: Mulch plants to prevent soil splash onto leaves.",
          pesticideWarning: "Streptomycin restricted in EU - check local regulations."
        }
      ];
      
      // Randomly select disease for demo
      const result = diseases[Math.floor(Math.random() * diseases.length)];
      resolve(result);
    }, 1500);
  });
}

// Process Scan Results
async function processScan(imageData) {
  loadingOverlay.classList.remove('hidden');
  
  try {
    // In production: const result = await fetch('/api/predict', { method: 'POST', body: formData })
    const result = await analyzeImage(imageData);
    
    // Populate results
    document.getElementById('disease-name').textContent = result.name;
    document.getElementById('confidence').textContent = result.confidence;
    document.getElementById('treatment').textContent = result.treatment;
    document.getElementById('prevention').innerHTML = result.prevention.map(item => `<li>${item}</li>`).join('');
    document.querySelector('.crop-tip').innerHTML = `🌾 <strong>${result.cropTip}</strong>`;
    document.querySelector('.warning').innerHTML = `⚠️ <strong>Pesticide Alert:</strong> ${result.pesticideWarning}`;
    
    // Set image previews
    document.getElementById('result-image').src = imageData;
    document.getElementById('highlight-image').src = imageData;
    
    // Show results
    showView(resultsView);
  } catch (error) {
    alert('Analysis failed. Please try again later.');
    console.error('Analysis error:', error);
  } finally {
    loadingOverlay.classList.add('hidden');
  }
}

// Save/Share Functionality
saveReportBtn.addEventListener('click', () => {
  if (!navigator.onLine) {
    showOfflineMessage();
    // Queue for later save (implement IndexedDB in production)
    return;
  }
  alert('✅ Report saved! View in "My Scans" section');
});

shareWhatsappBtn.addEventListener('click', () => {
  const disease = document.getElementById('disease-name').textContent;
  const message = `SmartAgro Report: ${disease} detected. Treatment: ${document.getElementById('treatment').textContent} - SmartAgro Advisor`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
});

// Offline Handling
function showOfflineMessage() {
  offlineIndicator.style.display = 'block';
  setTimeout(() => {
    offlineIndicator.style.display = 'none';
  }, 5000);
}

window.addEventListener('online', () => {
  offlineIndicator.style.display = 'none';
  // Process queued actions here
});

window.addEventListener('offline', showOfflineMessage);

// Reset scan state
function resetScan() {
  document.getElementById('preview-container').classList.add('hidden');
  document.getElementById('upload-instructions').classList.remove('hidden');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  if (!navigator.onLine) showOfflineMessage();
});