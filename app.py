import os
import base64
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import google.generativeai as genai
from PIL import Image
import io
import markdown

load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# --- Gemini API Configuration ---
try:
    genai.configure(api_key=os.environ["GEMINI_API_KEY"])
    model = genai.GenerativeModel('gemini-pro-vision')
except Exception as e:
    print(f"Error configuring Gemini API: {e}")
    model = None

# --- Emission Factors (simplified examples, kg CO2e) ---
# Source: Simplified from EPA and other environmental agencies for demonstration
EMISSION_FACTORS = {
    'electricity': 0.82,  # kg CO2e per kWh, assuming avg US grid. Bill to kWh is complex, so we use a multiplier.
    'car_mile': 0.404,    # kg CO2e per mile for an average gasoline car
    'flight_hour': 250,   # kg CO2e per hour of flight (very simplified)
    'diet': {
        'meat_lover': 3300, # kg CO2e per year
        'average': 2500,    # kg CO2e per year
        'vegetarian': 1700, # kg CO2e per year
        'vegan': 1500       # kg CO2e per year
    }
}

# --- Routes ---

@app.route('/')
def index():
    """Renders the homepage."""
    return render_template('index.html')

@app.route('/carbon-footprint')
def carbon_footprint():
    """Renders the Carbon Footprint Calculator page."""
    return render_template('carbon_footprint.html', result=None)

@app.route('/calculate-carbon-footprint', methods=['POST'])
def calculate_carbon_footprint():
    """Calculates the carbon footprint based on form data."""
    total_footprint = 0
    try:
        # 1. Electricity Calculation
        electricity_bill = float(request.form.get('electricity', 0))
        monthly_kwh = electricity_bill / 0.17 if electricity_bill > 0 else 0
        electricity_footprint = monthly_kwh * EMISSION_FACTORS['electricity'] * 12
        total_footprint += electricity_footprint

        # 2. Transportation Calculation
        car_miles_per_week = float(request.form.get('car_distance', 0))
        car_footprint = car_miles_per_week * 52 * EMISSION_FACTORS['car_mile']
        total_footprint += car_footprint

        # 3. Flight Calculation (assuming 3 hours per short-haul flight)
        flights_per_year = float(request.form.get('flights', 0))
        flight_footprint = flights_per_year * 3 * EMISSION_FACTORS['flight_hour']
        total_footprint += flight_footprint

        # 4. Diet Calculation
        diet_type = request.form.get('diet', 'average')
        diet_footprint = EMISSION_FACTORS['diet'].get(diet_type, 2500)
        total_footprint += diet_footprint
    except (ValueError, TypeError):
        # Handle cases where conversion to float fails
        return render_template('carbon_footprint.html', result=None, error="Invalid input. Please enter numbers only.")

    return render_template('carbon_footprint.html', result=total_footprint)


@app.route('/waste-classifier')
def waste_classifier():
    """Renders the Waste Classifier page."""
    return render_template('waste_classifier.html', result=None)

@app.route('/classify-waste', methods=['POST'])
def classify_waste():
    """Classifies the uploaded waste image using Gemini API."""
    if not model:
        return render_template('waste_classifier.html', error="AI Model is not configured. Please check the API key.")

    if 'waste_image' not in request.files or request.files['waste_image'].filename == '':
        return render_template('waste_classifier.html', error="No image selected. Please upload an image file.")

    image_file = request.files['waste_image']
    
    # Check if the file is an image
    allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    if '.' not in image_file.filename or image_file.filename.split('.')[-1].lower() not in allowed_extensions:
        return render_template('waste_classifier.html', error="Invalid file type. Please upload an image (png, jpg, jpeg, gif, webp).")

    try:
        # Read the image and convert to PIL Image object
        image_bytes = image_file.read()
        img = Image.open(io.BytesIO(image_bytes))

        # Prepare the prompt for Gemini
        prompt = """
        Analyze the image of the waste item and provide the following in Markdown format:
        1. A title identifying the item, prefixed with "## ".
        2. A "Classification" heading, prefixed with "### ". Classify the item into one of these categories: Recyclable, Organic Waste, E-Waste, or General Waste.
        3. A "How to Dispose" heading, prefixed with "### ". Provide a bulleted list of actionable tips for proper disposal or recycling.
        4. A "Environmental Tip" heading, prefixed with "### ". Give a short, encouraging tip related to reducing this type of waste.
        """

        # Call the Gemini API
        response = model.generate_content([prompt, img])
        
        # Convert markdown response to HTML
        result_text_html = markdown.markdown(response.text)

        # Encode the original image to display it on the results page
        image_b64 = base64.b64encode(image_bytes).decode('utf-8')

        result = {
            'text': result_text_html,
            'image_b64': image_b64
        }

        return render_template('waste_classifier.html', result=result)

    except Exception as e:
        # Catch potential API errors or other issues
        print(f"An error occurred: {e}")
        error_message = f"An error occurred while processing the image. The API may be unavailable or the image may be invalid. Details: {str(e)}"
        if "API_KEY_INVALID" in str(e):
            error_message = "The configured Gemini API key is invalid. Please check your .env file."
        return render_template('waste_classifier.html', error=error_message)


if __name__ == '__main__':
    app.run(debug=True)