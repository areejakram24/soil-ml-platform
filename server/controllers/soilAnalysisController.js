import SoilAnalysis from '../models/SoilAnalysis.js';
import axios from 'axios';

// @desc    Create a telemetry record entry and run machine learning predictions
// @route   POST /api/soil-analysis
export const createAnalysis = async (req, res) => {
  try {
    const { name, nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall } = req.body;
    const userId = req.user.id; // Assigned dynamically from auth security gate middleware

    if (!name || nitrogen === undefined || phosphorus === undefined || potassium === undefined ||
        temperature === undefined || humidity === undefined || ph === undefined || rainfall === undefined) {
      return res.status(400).json({ error: 'All telemetry metrics fields are required' });
    }

    const newAnalysis = new SoilAnalysis({
      userId,
      name,
      nitrogen,
      phosphorus,
      potassium,
      temperature,
      humidity,
      ph,
      rainfall,
      status: 'pending'
    });

    await newAnalysis.save();

    try {
      const fastApiResponse = await axios.post(
        process.env.FASTAPI_URL || 'http://127.0.0.1:8000/predict',
        {
            //to match the expected input format of the FastAPI model endpoint
          nitrogen: parseFloat(nitrogen),
          phosphorus: parseFloat(phosphorus),
          potassium: parseFloat(potassium),
          temperature: parseFloat(temperature),
          humidity: parseFloat(humidity),
          ph: parseFloat(ph),
          rainfall: parseFloat(rainfall)
        }
      );

      newAnalysis.predictedCrop =
        fastApiResponse.data.prediction ||
        fastApiResponse.data.crop ||
        fastApiResponse.data.recommended_crop ||
        '';
        
      newAnalysis.status = 'completed';
    } catch (apiError) {
      console.error(' Model core communication failure:', apiError.message);
      newAnalysis.status = 'failed';
    }

    await newAnalysis.save();

    res.status(201).json({
      message: 'Telemetry transaction processed',
      analysis: newAnalysis
    });

  } catch (error) {
    console.error('Exception inside createAnalysis execution:', error.message);
    res.status(500).json({ error: 'Failed to record entry logs' });
  }
};

// @desc    Retrieve all historical profiles matching an active user entity
// @route   GET /api/soil-analysis
export const getAnalyses = async (req, res) => {
  try {
    const userId = req.user.id;
    const analyses = await SoilAnalysis.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ analyses });
  } catch (error) {
    console.error('Exception inside getAnalyses execution:', error.message);
    res.status(500).json({ error: 'Failed to load telemetry matrix records' });
  }
};

// @desc    Fetch specific isolated record history profile details
// @route   GET /api/soil-analysis/:id
export const getAnalysisById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const analysis = await SoilAnalysis.findOne({ _id: id, userId });
    if (!analysis) {
      return res.status(404).json({ error: 'Record location not identified' });
    }

    res.status(200).json({ analysis });
  } catch (error) {
    console.error('Exception inside getAnalysisById execution:', error.message);
    res.status(500).json({ error: 'Failed to load profile record data' });
  }
};

// @desc    Update meta identifier labels or records metrics details
// @route   PUT /api/soil-analysis/:id
export const updateAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    // Filter update inputs safely instead of mutating variables one by one manually
    const analysis = await SoilAnalysis.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!analysis) {
      return res.status(404).json({ error: 'Target update target parameters not found' });
    }

    res.status(200).json({
      message: 'Record modifications updated successfully',
      analysis
    });
  } catch (error) {
    console.error('Exception inside updateAnalysis execution:', error.message);
    res.status(500).json({ error: 'Failed to process modifications save' });
  }
};

// @desc    Discard tracking profile entries from index tracking arrays
// @route   DELETE /api/soil-analysis/:id
export const deleteAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const analysis = await SoilAnalysis.findOneAndDelete({ _id: id, userId });
    if (!analysis) {
      return res.status(404).json({ error: 'Target deletion object context missing' });
    }

    res.status(200).json({ message: 'Record removed safely from profile data logs' });
  } catch (error) {
    console.error('Exception inside deleteAnalysis execution:', error.message);
    res.status(500).json({ error: 'Failed to drop database profile records target' });
  }
};