"use client";

import { useState } from "react";
import { Venus, Mars } from "lucide-react";
import Image from "next/image";
import { toast, Bounce } from "react-toastify";


// Add these color constants at the top of your component
const BMI_COLORS = {
  underweight: "bg-blue-500",
  normal: "bg-green-400",
  acceptable: "bg-green-500",
  overweight: "bg-orange-400",
  obeseOne: "bg-orange-500",
  obeseTwo: "bg-orange-600",
  obeseThree: "bg-red-500"
};

const BMICalculator = () => {
  const [age, setAge] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft-in">("cm");
  const [weight, setWeight] = useState<number | "">("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [bmi, setBmi] = useState<number | null>(null);
  const [classification, setClassification] = useState<string>("");
  const [normalWeightRange, setNormalWeightRange] = useState<[number, number] | null>(null);
  const [weightToLose, setWeightToLose] = useState<number | null>(null);
  const [feet, setFeet] = useState<number | "">("");
  const [inches, setInches] = useState<number | "">("");
  const [displayWeight, setDisplayWeight] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [isGenderLocked, setIsGenderLocked] = useState(false);

  // const Image = (props) => {
  //   return <img {...props} />;
  // };


  const convertFeetInchesToCm = (feet: number, inches: number): number => {
    return (feet * 30.48) + (inches * 2.54);
  };

  const convertCmToFeetInches = (cm: number): { feet: number; inches: number } => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches };
  };

  const handleHeightChange = (value: number, unit: "cm" | "ft-in") => {
    if (unit === "cm") {
      setHeight(value);
      const { feet, inches } = convertCmToFeetInches(value);
      setFeet(feet);
      setInches(inches);
    }
  };

  const handleFeetInchesChange = (feet: number, inches: number) => {
    const cmValue = convertFeetInchesToCm(feet, inches);
    setHeight(parseFloat(cmValue.toFixed(2)));
    setFeet(feet);
    setInches(inches);
  };

  const calculateBMI = () => {
    if (age === "" || gender === "" || height === "" || weight === "") {
      toast.error(`Please fill out all fields`, { 
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
  }
    
    setIsLoading(true);
    setShowResults(false);
    setShowImage(false);
    setIsGenderLocked(true);

    setTimeout(() => {
      setShowImage(true);
      const heightInMeters = height / 100;
      
      const weightInKg = weightUnit === "lbs" ? weight : Number(weight);
  
      const bmiValue = weightInKg / (heightInMeters * heightInMeters);
      setBmi(parseFloat(bmiValue.toFixed(1)));
  
      let classificationText = "";
      if (bmiValue < 18.5) classificationText = "Underweight";
      else if (bmiValue >= 18.5 && bmiValue < 25.0) classificationText = "Normal";
      else if (bmiValue >= 25.0 && bmiValue < 28.0) classificationText = "Acceptable";
      else if (bmiValue >= 28.0 && bmiValue < 29.9) classificationText = "Overweight";
      else if (bmiValue >= 30.0 && bmiValue < 34.9) classificationText = "Obese (Class 1)";
      else if (bmiValue >= 35.0 && bmiValue < 39.9) classificationText = "Obese (Class 2)";
      else classificationText = "Obese (Class 3)";
  
      setClassification(classificationText);
  
      const minWeight = 18.5 * (heightInMeters * heightInMeters);
      const maxWeight = 24.9 * (heightInMeters * heightInMeters);
      setNormalWeightRange([parseFloat(minWeight.toFixed(2)), parseFloat(maxWeight.toFixed(2))]);
  
      if (classificationText !== "Normal" && classificationText !== "Acceptable") {
        setWeightToLose(parseFloat((weightInKg - maxWeight).toFixed(2)));
      } else {
        setWeightToLose(null);
      }
      
      setIsLoading(false);
      setShowResults(true);
    }, 1000); 
  };
  
  const resetForm = () => {
    setAge("");
    setHeight("");
    setWeight("");
    setFeet("");
    setInches("");
    setDisplayWeight("");
    setBmi(null);
    setClassification("");
    setNormalWeightRange(null);
    setWeightToLose(null);
    setHeightUnit("cm");
    setWeightUnit("kg");
    setGender("");
    setShowResults(false);
    setIsGenderLocked(false); // Unlock gender selection
    setShowImage(false); // Hide image
};


  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg mb-5">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">BMI Calculator</h1>
      
      {/* Main container with responsive layout */}
      <div className="flex flex-col md:flex-row md:space-x-6">
        {/* Form section */}
        <div className="w-full md:w-1/2">
          <div className="mt-4">
            <label className="block font-semibold text-gray-800">Age</label>
            <input
              type="number"
              inputMode="decimal"
              pattern="[0-9]*"
              value={age}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue === "" || newValue === "0") {
                  setAge("");
                } else {
                  setAge(Number(newValue));
                }
              }}
              className="w-full p-2 border rounded-md text-gray-800"
              placeholder="Enter your age"
            />
          </div>

          <div className="mt-4">
            <label className="block font-semibold text-gray-800">Height</label>
            <div className="flex flex-col space-y-2">
              {heightUnit === "cm" ? (
                <input
                  type="number"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  value={height}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (newValue === "" || newValue === "0") {
                      setHeight("");
                      setFeet("");
                      setInches("");
                    } else {
                      setHeight(Number(newValue));
                      handleHeightChange(Number(newValue), "cm");
                    }
                  }}
                  className="w-full p-2 border rounded-md text-gray-800"
                  placeholder="Height in cm"
                />
              ) : (
                <div className="flex space-x-2">
                  <input
                    type="number"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    value={feet}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (newValue === "" || newValue === "0") {
                        setFeet("");
                      } else {
                        setFeet(Number(newValue));
                        handleFeetInchesChange(Number(newValue), Number(inches || 0));
                      }
                    }}
                    className="w-1/2 p-2 border rounded-md text-gray-800"
                    placeholder="Feet"
                  />
                  <input
                    type="number"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    value={inches}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (newValue === "" || newValue === "0") {
                        setInches("");
                      } else {
                        setInches(Number(newValue));
                        handleFeetInchesChange(Number(feet || 0), Number(newValue));
                      }
                    }}
                    className="w-1/2 p-2 border rounded-md text-gray-800"
                    placeholder="Inches"
                  />
                </div>
              )}
              <div className="flex space-x-2">
                <button
                  onClick={() => setHeightUnit("cm")}
                  className={`flex-1 px-4 py-2 rounded-md ${
                    heightUnit === "cm"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  cm
                </button>
                <button
                  onClick={() => setHeightUnit("ft-in")}
                  className={`flex-1 px-4 py-2 rounded-md ${
                    heightUnit === "ft-in"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  ft-in
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block font-semibold text-gray-800">Weight</label>
            <div className="flex flex-col space-y-2">
              <input
                type="number"
                inputMode="decimal"
                pattern="[0-9]*"
                value={displayWeight}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (newValue === "" || newValue === "0") {
                    setDisplayWeight("");
                    setWeight("");
                  } else {
                    setDisplayWeight(newValue);
                    const newWeight = Number(newValue);
                    if (weightUnit === "kg") {
                      setWeight(newWeight);
                    } else {
                      setWeight(parseFloat((newWeight * 0.453592).toFixed(2)));
                    }
                  }
                }}
                className="w-full p-2 border rounded-md text-gray-800"
                placeholder={`Weight in ${weightUnit}`}
              />

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    if (weightUnit === "lbs" && weight) {
                      setDisplayWeight(weight.toString());
                    }
                    setWeightUnit("kg");
                  }}
                  className={`flex-1 px-4 py-2 rounded-md ${
                    weightUnit === "kg"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  kg
                </button>
                <button
                  onClick={() => {
                    if (weightUnit === "kg" && weight) {
                      // convert kg to lbs
                      setDisplayWeight((Number(weight) * 2.20462).toFixed(2));
                    }
                    setWeightUnit("lbs");
                  }}
                  className={`flex-1 px-4 py-2 rounded-md ${
                    weightUnit === "lbs"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  lbs
                </button>
              </div>
            </div>
          </div>


        <div className="w-full mt-8 items-center justify-center text-center">
      {/* Gender Selection */}
      <p className="block font-semibold text-gray-800">Select Gender</p>
      <div className="flex space-x-4 justify-center w-full w-full">
      
        <button
          onClick={() => !isGenderLocked && setGender("male")}
          className={`w-[180px] px-4 py-3 rounded-md flex items-center justify-center space-x-2 ${
            gender === "male" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          <Mars /> <span>Male</span>
        </button>
        <button
          onClick={() => !isGenderLocked && setGender("female")}
          className={`w-[180px] px-4 py-3 rounded-md flex items-center justify-center space-x-2 ${
            gender === "female" ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          <Venus /> <span>Female</span>
        </button>
      </div>

      {/* Calculate BMI Button */}
      <button
        onClick={calculateBMI}
        className="mt-6 w-full bg-green-600 text-white p-3 mt-3 rounded-md hover:bg-green-800 transition-colors text-lg font-semibold"
      >
        Calculate BMI
      </button>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="mt-4 flex justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      

      {/* Show Image & Gender after Loading */}
      {!isLoading && showImage && gender && (
        
        <div className="mt-4 flex flex-col items-center">
          <Image
            src={gender === "male" ? "/images/male.png" : "/images/female.png"}
            alt={gender}
            width={250}
            height={250}
            className="rounded-md justify-center items-center hidden md:block" 
          />
          <span className="text-lg font-semibold mt-2 text-gray-800">
            {gender === "male" ? "♂️ Male" : "♀️ Female"}
          </span>
        </div>
      )}
    </div>
          

        </div>

        {/* Results section - will show beside on desktop, below on mobile */}
        <div className="w-full md:w-1/2 mt-6 md:mt-0">
          {showResults && !isLoading && bmi !== null ? (
            <div className="h-full p-4 bg-gray-100 rounded-md flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4">Results</h2>
                <div className="text-center mb-6">
                  <p className="text-xl text-gray-800 mb-2">Your BMI is</p>
                  <p className="text-4xl font-bold text-gray-900 mb-2">{bmi?.toFixed(1)}</p>
                  <div className={`inline-block px-4 py-2 rounded-full text-black font-bold ${
                    bmi < 18.5 ? BMI_COLORS.underweight :
                    bmi < 25.0 ? BMI_COLORS.normal :
                    bmi < 28.0 ? BMI_COLORS.acceptable :
                    bmi < 29.9 ? BMI_COLORS.overweight :
                    bmi < 34.9 ? BMI_COLORS.obeseOne :
                    bmi < 39.9 ? BMI_COLORS.obeseTwo :
                    BMI_COLORS.obeseThree
                  }`}>
                    {classification}
                  </div>
                </div>

                <p className="mt-2 text-lg text-gray-800 mb-6 text-center">
                  {heightUnit === "cm" 
                    ? `${height} cm | ${weightUnit === "kg" ? `${displayWeight} kg` : `${displayWeight} lbs`} | ${age} years old`
                    : `${feet}'${inches}" | ${weightUnit === "kg" ? `${displayWeight} kg` : `${displayWeight} lbs`} | ${age} years old`
                  }
                </p>

                {normalWeightRange && (
                  <p className="mt-2 text-lg text-gray-800 mb-6 text-center">
                    Normal Weight for Your Height ({height} cm): <br />
                    <strong>{normalWeightRange[0]} kg - {normalWeightRange[1]} kg</strong>
                  </p>
                )}

                {weightToLose !== null && weightToLose > 0 ? (
                  <p className="mt-2 text-lg text-red-500 mb-6 bg-red-100 text-center rounded-md p-2">
                    Your target weight loss is<br/><strong>{weightToLose} kg</strong><br/> to be in the normal weight range.
                  </p>
                ) : classification === "Normal" ? (
                  <p className="mt-2 text-lg text-gray-900 mb-6 font-bold bg-green-400 text-center rounded-md p-2">
                    Congratulations! You don&apos;t need to lose weight. You are in the normal weight range. 
                    You just need to maintain.
                  </p>
                ) : classification === "Acceptable" ? (
                  <p className="mt-2 text-lg text-gray-900 mb-6 shadow-md font-bold bg-green-500 rounded-md p-2 text-center">
                    You are in an acceptable weight range. You just need to maintain and reduce slightly.
                  </p>
                ) : null}

                <button
                  onClick={resetForm} 
                  className="mt-4 w-full bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-md transition-colors"
                >
                  Clear
                </button>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">BMI Classification</h3>
                <ul className="space-y-1">
                  <li className={`flex items-center p-1 rounded-md text-gray-800 ${bmi < 18.5 ? 'bg-blue-100' : ''}`}>
                    <div className="w-3 h-3 rounded-sm bg-blue-500 mr-2"></div>
                    <span><strong>Underweight:</strong> BMI &lt; 18.5</span>
                  </li>
                  <li className={`flex items-center p-1 rounded-md text-gray-800 ${bmi >= 18.5 && bmi < 25.0 ? 'bg-green-100' : ''}`}>
                    <div className="w-3 h-3 rounded-sm bg-green-500 mr-2"></div>
                    <span><strong>Normal:</strong> BMI 18.5 - 24.9</span>
                  </li>
                  <li className={`flex items-center p-1 rounded-md text-gray-800 ${bmi >= 25.0 && bmi < 28.0 ? 'bg-green-100' : ''}`}>
                    <div className="w-3 h-3 rounded-sm bg-green-400 mr-2"></div>
                    <span><strong>Acceptable:</strong> BMI 25.0 - 27.9</span>
                  </li>
                  <li className={`flex items-center p-1 rounded-md text-gray-800 ${bmi >= 28.0 && bmi < 29.9 ? 'bg-orange-100' : ''}`}>
                    <div className="w-3 h-3 rounded-sm bg-orange-400 mr-2"></div>
                    <span><strong>Overweight:</strong> BMI 28.0 - 29.9</span>
                  </li>
                  <li className={`flex items-center p-1 rounded-md text-gray-800 ${bmi >= 30.0 && bmi < 34.9 ? 'bg-orange-100' : ''}`}>
                    <div className="w-3 h-3 rounded-sm bg-orange-500 mr-2"></div>
                    <span><strong>Obese (Class 1):</strong> BMI 30.0 - 34.9</span>
                  </li>
                  <li className={`flex items-center p-1 rounded-md text-gray-800 ${bmi >= 35.0 && bmi < 39.9 ? 'bg-orange-200' : ''}`}>
                    <div className="w-3 h-3 rounded-sm bg-orange-600 mr-2"></div>
                    <span><strong>Obese (Class 2):</strong> BMI 35.0 - 39.9</span>
                  </li>
                  <li className={`flex items-center p-1 rounded-md text-gray-800 ${bmi >= 40.0 ? 'bg-red-100' : ''}`}>
                    <div className="w-3 h-3 rounded-sm bg-red-500 mr-2"></div>
                    <span><strong>Obese (Class 3):</strong> BMI ≥ 40.0</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full p-4 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
              <div className="text-center">
                <h2 className="text-lg font-bold text-gray-800 mb-2">BMI Classification</h2>
                <p className="mb-4">Fill out the form and click &quot;Calculate BMI&quot; to see your results</p>
                <ul className="space-y-1 text-left">
                  <li className="flex items-center p-1 rounded-md text-gray-800">
                    <div className="w-3 h-3 rounded-sm bg-blue-500 mr-2"></div>
                    <span><strong>Underweight:</strong> BMI &lt; 18.5</span>
                  </li>
                  <li className="flex items-center p-1 rounded-md text-gray-800">
                    <div className="w-3 h-3 rounded-sm bg-green-500 mr-2"></div>
                    <span><strong>Normal:</strong> BMI 18.5 - 24.9</span>
                  </li>
                  <li className="flex items-center p-1 rounded-md text-gray-800">
                    <div className="w-3 h-3 rounded-sm bg-green-400 mr-2"></div>
                    <span><strong>Acceptable:</strong> BMI 25.0 - 27.9</span>
                  </li>
                  <li className="flex items-center p-1 rounded-md text-gray-800">
                    <div className="w-3 h-3 rounded-sm bg-orange-400 mr-2"></div>
                    <span><strong>Overweight:</strong> BMI 28.0 - 29.9</span>
                  </li>
                  <li className="flex items-center p-1 rounded-md text-gray-800">
                    <div className="w-3 h-3 rounded-sm bg-orange-500 mr-2"></div>
                    <span><strong>Obese (Class 1):</strong> BMI 30.0 - 34.9</span>
                  </li>
                  <li className="flex items-center p-1 rounded-md text-gray-800">
                    <div className="w-3 h-3 rounded-sm bg-orange-600 mr-2"></div>
                    <span><strong>Obese (Class 2):</strong> BMI 35.0 - 39.9</span>
                  </li>
                  <li className="flex items-center p-1 rounded-md text-gray-800">
                    <div className="w-3 h-3 rounded-sm bg-red-500 mr-2"></div>
                    <span><strong>Obese (Class 3):</strong> BMI ≥ 40.0</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer section */}
      <div className="mt-8 text-center text-gray-800 text-sm">
        <p>
          Created by{" "}
          <a 
            href="https://www.markjasonp.online/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 underline"
          >
            Mark Jason Morales
          </a>
        </p>
        <p className="mt-1">© 2025 Mark Jason Morales. All rights reserved.</p>
      </div>
    </div>
  );
};

export default BMICalculator;