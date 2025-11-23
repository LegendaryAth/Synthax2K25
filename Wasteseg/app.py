from flask import Flask, request, jsonify, render_template
import cv2
import base64
import numpy as np
from cvzone.ClassificationModule import Classifier

app = Flask(__name__)

# Load classifier
classifier = Classifier('Wasteseg/Model/keras_model.h5', 'Wasteseg/Model/labels.txt')

CLASS_MAPPING = {
    0: 'Unknown/None',
    1: 'Cardboard-Biodegradable',
    2: 'Glass-Solid Waste',
    3: 'Footwear-Textile waste',
    4: 'Clothes-Textile waste',
    5: 'Metal-Non-Biodegradable',
    6: 'Paper-Biodegradable',
    7: 'Battery-Hazardous',
    8: 'Organic Waste-Biodegradable',
    9: 'Toothbrush-Non-Biodegradable',
    10: 'Diaper/Pads-Rejected Waste',
    11: 'Mask-Household waste',
    12: 'Plastic-Non-biodegradable',
    13: 'Phone-E-waste',
}

# Serve HTML page
@app.route('/')
def home():
    return render_template('index.html')

# Prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    if not data or 'image' not in data:
        return jsonify({'error': 'No image provided'}), 400

    img_data = data['image']
    try:
        encoded_data = img_data.split(',')[1] if ',' in img_data else img_data
        np_arr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if img is None:
            return jsonify({'error': 'Could not decode image'}), 400
    except Exception as e:
        return jsonify({'error': f'Image decoding failed: {str(e)}'}), 400

    try:
        prediction, classID = classifier.getPrediction(img)
        class_name = CLASS_MAPPING.get(classID, 'Unknown Waste Type')
        return jsonify({'class_id': int(classID), 'prediction_text': class_name})
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
