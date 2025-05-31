const mongoose = require('mongoose');

const chargingStationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  location: {
    type: {
      latitude: {
        type: Number,
        required: [true, 'Latitude is required'],
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90']
      },
      longitude: {
        type: Number,
        required: [true, 'Longitude is required'],
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
      },
      address: {
        type: String,
        trim: true
      }
    },
    required: [true, 'Location is required']
  },
  status: {
    type: String,
    enum: {
        values: ['Active', 'Inactive', 'Maintenance'],
        message: '{VALUE} is not a valid status'
    },
    default: 'Active'
  },
  powerOutput: {
    type: Number,
    required: [true, 'Power output is required'],
    min: [0, 'Power output must be a positive number']
  },
  connectorType: {
    type: String,
    required: [true, 'Connector type is required'],
    enum: {
      values: ['Type 1', 'Type 2', 'CCS', 'CHAdeMO', 'Tesla'],
      message: '{VALUE} is not a valid connector type'
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Add geospatial index for location-based queries
chargingStationSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });

const ChargingStation = mongoose.model('ChargingStation', chargingStationSchema);
module.exports = ChargingStation;