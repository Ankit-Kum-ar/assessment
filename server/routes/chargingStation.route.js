const express = require('express');
const { 
    createStation, 
    getAllStations, 
    getStationById, 
    updateStation, 
    deleteStation 
} = require('../controllers/chargingStation.controller');
// const authMiddleware = require('../middlewares/auth.middleware');

const chargingStationRouter = express.Router();
// Authentication middleware
// chargingStationRouter.use(authMiddleware);


chargingStationRouter.post('/', createStation);
chargingStationRouter.get('/', getAllStations);
chargingStationRouter.get('/:id', getStationById);
chargingStationRouter.put('/:id', updateStation);
chargingStationRouter.delete('/:id', deleteStation);

module.exports = chargingStationRouter;