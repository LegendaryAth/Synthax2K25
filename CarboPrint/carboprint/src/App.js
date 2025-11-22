import React, { useState } from "react";
import "./App.css";

const CarboPrint = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    vehicleOwned: "",
    foodType: "",
    meatType: "",
    clothType: "",
    IntTravelPerYear: "",
    buildingType: "",
    waterUsageDay: "",
    transportType: "",
    workCulture: "",
    Gardens: "",
    fuelTypeVehicle: "",
    fuelTypeDomestic: "",
    DailyTravel: ""
  });

  const [carbonFootprint, setCarbonFootprint] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = 16;

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateCarbonFootprint = () => {
    let userTotalData = 0;

    if (formData.vehicleOwned === "Yes") userTotalData += 500;

    userTotalData +=
      formData.foodType === "Vegetarian" ? 100 :
      formData.foodType === "Lacto-Vegetarian" ? 200 :
      formData.foodType === "Pescetarian" ? 300 :
      formData.foodType === "Flexitarian" ? 400 :
      formData.foodType === "Non-Vegetarian" ? 500 : 0;

    userTotalData +=
      formData.meatType === "Beef" ? 800 :
      formData.meatType === "Mutton" ? 750 :
      formData.meatType === "Bacon" ? 700 :
      formData.meatType === "Pork" ? 650 :
      formData.meatType === "Turkey" ? 500 :
      formData.meatType === "Duck" ? 450 :
      formData.meatType === "Chicken" ? 400 :
      formData.meatType === "Seafood" ? 300 : 0;

    userTotalData +=
      formData.clothType === "Silk" ? 700 :
      formData.clothType === "Velvet" ? 660 :
      formData.clothType === "Georgette" ? 640 :
      formData.clothType === "Nylon" ? 580 :
      formData.clothType === "Wool" ? 550 :
      formData.clothType === "Rayon" ? 510 :
      formData.clothType === "Denim" ? 470 :
      formData.clothType === "Cotton" ? 440 : 0;

    userTotalData += Number(formData.IntTravelPerYear) * 200 || 0;

    userTotalData +=
      formData.buildingType === "High-Rise" ? 500 :
      formData.buildingType === "Low-Rise" ? 300 :
      formData.buildingType === "Independent" ? 650 : 0;

    userTotalData += Number(formData.waterUsageDay) || 0;

    userTotalData +=
      formData.transportType === "Bus" ? 600 :
      formData.transportType === "Bike" ? 400 :
      formData.transportType === "Car" ? 500 :
      formData.transportType === "Train" ? 750 : 0;

    if (formData.workCulture === "at home") {
      userTotalData /= 2;
    } else if (formData.workCulture === "at office") {
      userTotalData *= 2;
    }

    if (formData.Gardens === "Yes") {
      userTotalData /= 2;
    } else if (formData.Gardens === "No") {
      userTotalData *= 1.5;
    }

    userTotalData +=
      formData.fuelTypeVehicle === "Petrol" ? 500 :
      formData.fuelTypeVehicle === "Diesel" ? 450 :
      formData.fuelTypeVehicle === "Gasoline" ? 600 :
      formData.fuelTypeVehicle === "Hydrogen" ? 250 : 0;

    return userTotalData;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const total = calculateCarbonFootprint();
    setCarbonFootprint(total);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div>
        <h1 className="title">CarboPrint</h1>
      <form onSubmit={handleSubmit}>
        {currentSlide === 0 && (
          <>
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
            />
            <br />
            <br />
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
            />
          </>
        )}
        {currentSlide === 1 && (
          <>
            <label htmlFor="vehicleOwned">Do you own a vehicle? (Yes/No)</label>
            <input
              type="text"
              id="vehicleOwned"
              name="vehicleOwned"
              value={formData.vehicleOwned}
              onChange={handleChange}
            />
          </>
        )}
        {currentSlide === 2 && (
          <>
            <label htmlFor="foodType">Choose one of the food types</label>
            <input
              list="foodTypes"
              id="foodType"
              name="foodType"
              value={formData.foodType}
              onChange={handleChange}
            />
            <datalist id="foodTypes">
              <option value="Vegetarian" />
              <option value="Lacto-Vegetarian" />
              <option value="Non-Vegetarian" />
              <option value="Pescetarian" />
              <option value="Flexitarian" />
            </datalist>
          </>
        )}
        {currentSlide === 3 && (
          <>
            <label htmlFor="meatType">
              Choose multiple meats you eat from the list (space separated), leave empty if vegetarian
            </label>
            <input
              type="text"
              id="meatType"
              name="meatType"
              value={formData.meatType}
              onChange={handleChange}
            />
            <ul style={{ listStyleType: "none" }}>
              <li>Beef</li>
              <li>Lamb</li>
              <li>Bacon</li>
              <li>Pork</li>
              <li>Turkey</li>
              <li>Duck</li>
              <li>Seafood</li>
            </ul>
          </>
        )}
        {currentSlide === 4 && (
          <>
            <label htmlFor="clothType">
              What type of cloth do you mostly use? Choose one from the list
            </label>
            <input
              type="text"
              id="clothType"
              name="clothType"
              value={formData.clothType}
              onChange={handleChange}
            />
            <ul>
              <li>Silk</li>
              <li>Satin</li>
              <li>Georgette</li>
              <li>Nylon</li>
              <li>Wool</li>
              <li>Rayon</li>
              <li>Denim</li>
              <li>Jersey</li>
              <li>Cotton</li>
            </ul>
          </>
        )}
        {currentSlide === 5 && (
          <>
            <label htmlFor="IntTravelPerYear">
              How many times do you travel international per year?
            </label>
            <input
              type="number"
              id="IntTravelPerYear"
              name="IntTravelPerYear"
              value={formData.IntTravelPerYear}
              onChange={handleChange}
            />
          </>
        )}
        {currentSlide === 6 && (
          <>
            <label htmlFor="buildingType">
              What type of building you live in? Choose one from list
            </label>
            <input
              type="text"
              id="buildingType"
              name="buildingType"
              value={formData.buildingType}
              onChange={handleChange}
            />
            <ul>
              <li>High-Rise</li>
              <li>Independent</li>
              <li>Low-Rise</li>
            </ul>
          </>
        )}
        {currentSlide === 7 && (
          <>
            <label htmlFor="waterUsageDay">How many litres of water you use per day?</label>
            <input
              type="number"
              id="waterUsageDay"
              name="waterUsageDay"
              value={formData.waterUsageDay}
              onChange={handleChange}
            />
          </>
        )}
        {currentSlide === 8 && (
          <>
            <label htmlFor="transportType">
              What type of transport do you use? Type one from the list
            </label>
            <input
              type="text"
              id="transportType"
              name="transportType"
              value={formData.transportType}
              onChange={handleChange}
            />
            <ul>
              <li>Bus</li>
              <li>Bike</li>
              <li>Car</li>
              <li>Train</li>
            </ul>
          </>
        )}
        {currentSlide === 9 && (
          <>
            <label htmlFor="workCulture">Do you work at home/at office?</label>
            <input
              type="text"
              id="workCulture"
              name="workCulture"
              value={formData.workCulture}
              onChange={handleChange}
            />
          </>
        )}
        {currentSlide === 10 && (
          <>
            <label htmlFor="Gardens">Do you garden plants or not? (Yes/No)</label>
            <input
              type="text"
              id="Gardens"
              name="Gardens"
              value={formData.Gardens}
              onChange={handleChange}
            />
          </>
        )}
        {currentSlide === 11 && (
          <>
            <label htmlFor="fuelTypeVehicle">What fuel are you using for your vehicles?</label>
            <input
              type="text"
              id="fuelTypeVehicle"
              name="fuelTypeVehicle"
              value={formData.fuelTypeVehicle}
              onChange={handleChange}
            />
          </>
        )}
        {currentSlide === 12 && (
          <>
            <label htmlFor="fuelTypeDomestic">What fuel are you using at home? For domestic use?</label>
            <input
              type="text"
              id="fuelTypeDomestic"
              name="fuelTypeDomestic"
              value={formData.fuelTypeDomestic}
              onChange={handleChange}
            />
          </>
        )}
        {currentSlide === 13 && (
          <>
            <label htmlFor="DailyTravel">How many kilometres do you travel daily?</label>
            <input
              type="number"
              id="DailyTravel"
              name="DailyTravel"
              value={formData.DailyTravel}
              onChange={handleChange}
            />
          </>
        )}
        {currentSlide === 14 && (
          <>
            <button type="submit">Submit</button>
          </>
        )}
        {currentSlide === 15 && (
          <>
            <h1>Your carbon footprint is:</h1>
            <h2>{carbonFootprint !== null ? carbonFootprint : "Please submit the form."}</h2>
          </>
        )}
      </form>
      <br />
      <button onClick={prevSlide} disabled={currentSlide === 0}>
        Previous
      </button>
      <button onClick={nextSlide} disabled={currentSlide === totalSlides - 1}>
        Next
      </button>
    </div>
  );
};

export default CarboPrint;
