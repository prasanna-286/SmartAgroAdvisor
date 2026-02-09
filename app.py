from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import uuid
from datetime import datetime
from model_mock import mock_predict  # Replace with real model inference

app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max

# In-memory storage for demo (use database in production)
scan_history = []

@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

@app.route('/api/predict', methods=['POST'])
def predict_disease():
    """AI Disease Prediction Endpoint"""
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Save uploaded image
    filename = f"{uuid.uuid4().hex}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    
    try:
        # REAL IMPLEMENTATION: 
        # prediction = real_model.predict(filepath)
        # For demo: Use mock prediction
        prediction = mock_predict(filepath)
        
        # Save to history (demo only)
        scan_record = {
            'id': str(uuid.uuid4()),
            'timestamp': datetime.now().isoformat(),
            'disease': prediction['disease'],
            'confidence': prediction['confidence'],
            'treatment': prediction['treatment'],
            'image_path': filename
        }
        scan_history.append(scan_record)
        
        return jsonify(prediction), 200
        
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return jsonify({'error': 'Analysis failed. Please try again.'}), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    """Get user's scan history (demo only)"""
    return jsonify(scan_history[-10:]), 200  # Return last 10 scans

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    """Regional disease alerts (demo)"""
    return jsonify([
        {
            'region': 'Maharashtra',
            'disease': 'Brown Spot Fungus',
            'severity': 'High',
            'message': 'Spreading rapidly in paddy fields. Apply preventive measures immediately.'
        },
        {
            'region': 'Punjab',
            'disease': 'Wheat Rust',
            'severity': 'Medium',
            'message': 'Early detection reported. Monitor crops closely.'
        }
    ]), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)