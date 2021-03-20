const { Router } = require('express');
const { check } = require('express-validator');
const { fieldsValidator } = require('../../middlewares/fieldsValidator');
const { createCar, getCar, getCars, updateCar, deleteCar, uploadFile } = require('./carAppService');

const router = Router();

/*
    Cars Routers
    host + /api/cars
*/

router.post('/', createCar);

router.get('/', getCars);

router.get('/:id', getCar);

router.put('/:id',
    [
        check('UUID', 'The UUID can not be null or empty.').not().isEmpty(),
        check('VIN', 'The VIN can not be null or empty.').not().isEmpty(),
        check('Make', 'The Make can not be null or empty.').not().isEmpty(),
        check('Model', 'The Model can not be null or empty.').not().isEmpty(),
        fieldsValidator
    ],
    updateCar);

router.delete('/:id', deleteCar);

router.post('/upload', uploadFile)

module.exports = router;
