import random
import time

# Mock disease database (replace with real model predictions)
DISEASE_DATABASE = [
    {
        "disease": "Late Blight",
        "scientific_name": "Phytophthora infestans",
        "confidence": 0.92,
        "treatment": "Spray copper-based fungicide (2g/L water) every 7 days. Remove infected leaves immediately.",
        "prevention": [
            "Avoid overhead irrigation",
            "Space plants for better airflow",
            "Apply neem oil weekly as preventive measure"
        ],
        "crop_tip": "Tomato Specific: Remove lower leaves to reduce humidity near soil.",
        "pesticide_warning": "Chlorothalonil banned in your region. Use copper oxychloride instead.",
        "severity": "High"
    },
    {
        "disease": "Yellow Rust",
        "scientific_name": "Puccinia striiformis",
        "confidence": 0.87,
        "treatment": "Apply triadimefon (0.05%) at first sign of disease. Repeat after 15 days.",
        "prevention": [
            "Use resistant wheat varieties",
            "Avoid excessive nitrogen fertilizer",
            "Destroy volunteer wheat plants"
        ],
        "crop_tip": "Wheat Specific: Rotate crops with non-cereal plants every 2 years.",
        "pesticide_warning": "Avoid propiconazole during grain filling stage.",
        "severity": "Medium"
    },
    {
        "disease": "Bacterial Spot",
        "scientific_name": "Xanthomonas campestris",
        "confidence": 0.78,
        "treatment": "Spray streptomycin sulfate (100 ppm) or copper hydroxide. Remove severely infected plants.",
        "prevention": [
            "Use disease-free seeds",
            "Avoid working in fields when wet",
            "Practice 2-year crop rotation"
        ],
        "crop_tip": "Pepper Specific: Mulch plants to prevent soil splash onto leaves.",
        "pesticide_warning": "Streptomycin restricted in EU - check local regulations.",
        "severity": "Medium"
    },
    {
        "disease": "Healthy",
        "scientific_name": "",
        "confidence": 0.95,
        "treatment": "No treatment needed! Continue current practices.",
        "prevention": [
            "Maintain regular monitoring",
            "Follow crop rotation schedule",
            "Ensure proper soil nutrition"
        ],
        "crop_tip": "Keep up the good work! Your crop shows no signs of disease.",
        "pesticide_warning": "",
        "severity": "None"
    }
]

def mock_predict(image_path):
    """
    Simulates AI model prediction.
    In production: Replace with TensorFlow/PyTorch model inference
    """
    # Simulate processing time
    time.sleep(0.5)
    
    # 80% chance of disease, 20% healthy (adjust as needed)
    if random.random() < 0.8:
        prediction = random.choice(DISEASE_DATABASE[:-1])  # Exclude healthy
    else:
        prediction = DISEASE_DATABASE[-1]  # Healthy
    
    # Format response for frontend
    return {
        "disease": prediction["disease"],
        "scientific_name": prediction["scientific_name"],
        "confidence": f"{int(prediction['confidence'] * 100)}%",
        "treatment": prediction["treatment"],
        "prevention": prediction["prevention"],
        "crop_tip": prediction["crop_tip"],
        "pesticide_warning": prediction["pesticide_warning"],
        "severity": prediction["severity"],
        "image_analysis": {
            "highlight_areas": [
                {"x": 25, "y": 35, "width": 50, "height": 30}
            ]
        }
    }