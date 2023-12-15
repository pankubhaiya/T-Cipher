const express = require("express");

const BMIRouter = express.Router();

const BMI = require('../models/BMI');

const calculateHeightInInches = (feet, inches) => {
  return feet * 12 + inches;
};

const calculateBMI = (weight, feet, inches) => {
  const heightInInches = calculateHeightInInches(feet, inches);
  const bmi = (weight / Math.pow(heightInInches, 2)) * 703; 

  if (bmi < 18.5) return 'Underweight';
  if (bmi >= 18.5 && bmi < 25) return 'Fit';
  return 'Overweight';
};

BMIRouter.post('/calculateBMI', async (req, res) => {
  const { weight, feet, inches } = req.body;

 
  if (!weight || !feet || !inches || weight <= 0 || feet < 0 || inches < 0 || inches >= 12) {
    return res.status(400).json({ error: 'Invalid weight, feet, or inches' });
  }

  const result = calculateBMI(weight, feet, inches);

  try {
    const bmiData = new BMI({ weight, feet, inches, result });
    await bmiData.save();
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error: 'Could not calculate BMI' });
  }
});

BMIRouter.get('/GetAllBMI', async (req, res) => {
  try {
    const allBMIRecords = await BMI.find();
   
    return res.status(200).json(allBMIRecords);
  } catch (error) {
    return res.status(500).json({ error: 'Could not fetch BMI records' });
  }
});



BMIRouter.put('/UpdateBMI/:id', async (req, res) => {
  const { id } = req.params;
  const { weight, feet, inches } = req.body;

  try {
    const bmiData = await BMI.findById(id);

    if (!bmiData) {
      return res.status(404).json({ error: 'BMI record not found' });
    }

    
    if (weight) {
      bmiData.weight = weight;
    }

    if (feet) {
      bmiData.feet = feet;
    }

    if (inches) {
      bmiData.inches = inches;
    }

   
    bmiData.result = calculateBMI(bmiData.weight, bmiData.feet, bmiData.inches);

    await bmiData.save();

    return res.status(200).json(bmiData);
  } catch (error) {
    return res.status(500).json({ error: 'Could not update BMI' });
  }
});

BMIRouter.delete('/DeleteBMI/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const bmiData = await BMI.findByIdAndDelete(id);

    if (!bmiData) {
      return res.status(404).json({ error: 'BMI record not found' });
    }

    return res.status(200).json({ message: 'BMI record deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Could not delete BMI record' });
  }
});


module.exports = BMIRouter;
