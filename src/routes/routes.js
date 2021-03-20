const { Router } = require('express');
const router = Router();
const apiPrefix = '/api';

// Importing Routers
const cars = require('../features/cars/carRoutes');

// Implementing Routers
router.use(`${ apiPrefix }/cars`, cars);

module.exports = router;
