const ChargingStation = require("../models/chargingStation.model");

// Create a new charging station
const createStation = async (req, res) => {
  try {
    const { name, location, status, powerOutput, connectorType } = req.body;
    
    // Validate required fields
    if (!name || !location || !powerOutput || !connectorType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate location structure
    if (!location || typeof location !== 'object' || !location.latitude || !location.longitude) {
      return res.status(400).json({ message: 'Invalid location format. Must include latitude and longitude.' });
    }

    // Check if record already exists with the same name and location
    const existingStation = await ChargingStation.findOne({
      name,
      'location.latitude': location.latitude,
      'location.longitude': location.longitude
    });

    if (existingStation) {
      return res.status(400).json({ message: 'Charging station already exists at this location' });
    }

    // Create new charging station
    const station = new ChargingStation({
      name,
      location,
      status,
      powerOutput,
      connectorType,
      owner: req.user.id // Assuming user ID is available from authentication middleware
    });
    
    // Validate the station data
    const validationError = station.validateSync();
    if (validationError) {
      return res.status(400).json({ message: validationError.message });
    }
    
    await station.save();
    
    res.status(201).json({
      success: true,
      message: 'Charging station created successfully',
      data: station
    });
    
  } catch (error) {
    console.error('Error creating charging station:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// Get all charging stations
const getAllStations = async (req, res) => {
  try {
    // Add filters if provided in query params
    const filter = {};
    if (req.query.status) filter.status = req.query.status; // Filter by status
    if (req.query.connectorType) filter.connectorType = req.query.connectorType; // Filter by connector type
    if (req.query.powerOutput) filter.powerOutput = { $gte: req.query.powerOutput }; // Filter by minimum power output

    const stations = await ChargingStation.find(filter);
    
    res.status(200).json({
      success: true,
      message: 'Charging stations retrieved successfully',
      count: stations.length,
      data: stations
    });
    
  } catch (error) {
    console.error('Error fetching charging stations:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// Get a single charging station by ID
const getStationById = async (req, res) => {
  try {
    const station = await ChargingStation.findById(req.params.id);
    
    if (!station) {
      return res.status(404).json({ message: 'Charging station not found' });
    }
    
    res.status(200).json({
      success: true,
      message: 'Charging station retrieved successfully',
      data: station
    });
    
  } catch (error) {
    console.error('Error fetching charging station:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// Update a charging station
const updateStation = async (req, res) => {
  try {
    const { name, location, status, powerOutput, connectorType } = req.body;
    
    // Find the station
    let station = await ChargingStation.findById(req.params.id);
    
    if (!station) {
      return res.status(404).json({ message: 'Charging station not found' });
    }
    
    // Check if user owns this station (authorization)
    if (station.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this station' });
    }
    
    // Update fields
    station = await ChargingStation.findByIdAndUpdate(
      req.params.id, 
      { name, location, status, powerOutput, connectorType },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: station
    });
    
  } catch (error) {
    console.error('Error updating charging station:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// Delete a charging station
const deleteStation = async (req, res) => {
  try {
    const station = await ChargingStation.findById(req.params.id);
    
    if (!station) {
      return res.status(404).json({ message: 'Charging station not found' });
    }
    
    // Check if user owns this station (authorization)
    if (station.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this station' });
    }
    
    await station.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Charging station deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting charging station:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

module.exports = {
  createStation,
  getAllStations,
  getStationById,
  updateStation,
  deleteStation
};