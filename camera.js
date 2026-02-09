const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const cameraBtn = document.getElementById('camera-btn');
const galleryBtn = document.getElementById('gallery-btn');
const retakeBtn = document.getElementById('retake-btn');
const previewContainer = document.getElementById('preview-container');
const imagePreview = document.getElementById('image-preview');
const uploadInstructions = document.getElementById('upload-instructions');

// Camera Access
cameraBtn.addEventListener('click', async () => {
  if ('mediaDevices' in navigator) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Create temporary video element
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      // Capture interface
      const captureDiv = document.createElement('div');
      captureDiv.innerHTML = `
        <div style="position:fixed; top:0; left:0; width:100%; height:100%; background:black; z-index:1000; display:flex; flex-direction:column; justify-content:center; align-items:center;">
          <video id="capture-video" style="width:95%; max-width:500px; border-radius:20px;" autoplay></video>
          <button id="capture-btn" style="margin-top:20px; padding:15px 40px; background:white; border:none; border-radius:50px; font-size:1.2rem; font-weight:bold;">📸 Capture</button>
          <button id="cancel-capture" style="margin-top:15px; background:transparent; border:none; color:white; font-size:1.1rem;">Cancel</button>
        </div>
      `;
      document.body.appendChild(captureDiv);
      document.getElementById('capture-video').srcObject = stream;
      
      // Capture photo
      document.getElementById('capture-btn').addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        const video = document.getElementById('capture-video');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        
        // Stop stream
        stream.getTracks().forEach(track => track.stop());
        
        // Convert to image
        canvas.toBlob((blob) => {
          const imageUrl = URL.createObjectURL(blob);
          imagePreview.src = imageUrl;
          previewContainer.classList.remove('hidden');
          uploadInstructions.classList.add('hidden');
          
          // Process scan
          processScan(imageUrl);
          
          // Cleanup
          document.body.removeChild(captureDiv);
        }, 'image/jpeg', 0.8);
      });
      
      // Cancel capture
      document.getElementById('cancel-capture').addEventListener('click', () => {
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(captureDiv);
      });
      
    } catch (err) {
      alert('Camera access denied. Please upload a photo instead.');
      console.error('Camera error:', err);
    }
  } else {
    alert('Camera not supported on this device. Please upload a photo.');
  }
});

// Gallery Upload
galleryBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleImageSelect);

// Drag & Drop
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight() {
  dropArea.style.borderColor = '#4caf50';
  dropArea.style.backgroundColor = '#e8f5e9';
}

function unhighlight() {
  dropArea.style.borderColor = '';
  dropArea.style.backgroundColor = '';
}

dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  if (files.length) handleImageSelect({ target: { files } });
}

function handleImageSelect(e) {
  const file = e.target.files[0];
  if (!file.type.match('image.*')) {
    alert('Please select an image file');
    return;
  }
  
  // Compress image for low bandwidth (critical for farmers)
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.src = event.target.result;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Max dimensions for mobile
      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 600;
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      // Compress to 70% quality
      canvas.toBlob((blob) => {
        const compressedUrl = URL.createObjectURL(blob);
        imagePreview.src = compressedUrl;
        previewContainer.classList.remove('hidden');
        uploadInstructions.classList.add('hidden');
        
        // Process scan
        processScan(compressedUrl);
      }, 'image.jpeg', 0.7);
    };
  };
  reader.readAsDataURL(file);
}

// Retake photo
retakeBtn.addEventListener('click', () => {
  previewContainer.classList.add('hidden');
  uploadInstructions.classList.remove('hidden');
  fileInput.value = '';
});