const { response } = require('express');
const db = require('../../db/cars');
const moment = require('moment');
const csv = require('csv-parser');
const fs = require('fs');

// POST: api/upload
const uploadFile = async( req, res = response ) => {
    let providerName = req.body.provider;
    let file = req.files.file;
    let fileName = providerName.length == 0 ? file.name : providerName + '.csv';

    if(file) {
        file.mv('./src/uploads/' + fileName, (err) => {
            if( err ) {
                console.log(err);
            } else {
                CsvToDb(fileName);
                return res.send('File Uploaded!!');
            }
        });
    }
}

// POST: api/cars/
const createCar = async( req, res = response ) => {
    const carsInfo = await db.getCar(req.body.UUID);

    if (carsInfo.length > 0) {
        return res.status(400).json({
            Data: carsInfo[0],
            Message: 'This UUID is already registered.',
            OK: false
        });
    }
    let newCar = {
        ...req.body,
        CreateDate: moment().format('MMMM Do YYYY, h:mm:ss a'),
        UpdateDate: moment().format('MMMM Do YYYY, h:mm:ss a')
    };
    await db.createCar(newCar);

    return res.status(201).json({
        Data: newCar,
        Message: '',
        OK: true
    });
}

// GET: api/cars/
const getCars = async( req, res = response ) => {
    const cars = await db.getAllCars();

    return res.status(200).json({
        Data: cars,
        Message: '',
        OK: true
    });
}

// GET: api/cars/:id
const getCar = async( req, res = response ) => {
    const car = await db.getCar(req.params.id);

    return res.status(200).json({
        Data: car,
        Message: '',
        OK: true
    });
}

// PUT: api/cars/:id
const updateCar = async( req, res = response ) => {
    const carsInfo = await db.getCar(req.params.id);

    if (carsInfo.length === 0) {
        return res.status(404).json({
            Data: null,
            Message: 'This ID could not be found.',
            OK: false
        });
    }

    let newCar = {
        ...req.body,
        CreateDate: req.CreateDate === null || req.CreateDate === '' ? moment().format('MMMM Do YYYY, h:mm:ss a') : carsInfo[0].CreateDate,
        UpdateDate: moment().format('MMMM Do YYYY, h:mm:ss a')
    };

    await db.updateCar(req.params.id, newCar);

    return res.status(200).json({
        Data: newCar,
        Message: '',
        OK: true
    });
}

// DELETE: api/cars/:id
const deleteCar = async( req, res = response ) => {
    const carsInfo = await db.getCar(req.params.id);

    if (carsInfo.length === 0) {
        return res.status(404).json({
            Data: null,
            Message: 'This ID could not be found.',
            OK: false
        });
    }
    
    await db.deleteCar(req.params.id);

    return res.status(200).json({
        Data: carsInfo[0],
        Message: '',
        OK: true
    });
}

const CsvToDb = async(fileName) => {
    const filePath = './src/uploads/' + fileName;
    let results = [];

    fs.createReadStream(filePath)
        .pipe(csv({}))
        .on('data', (car) => results.push(car))
        .on('end', () => {
            saveCarRegisters(results);
        });
}

const saveCarRegisters = (results) => {
    results.forEach((car) => {
        const carsInfo = db.getCar(car.UUID);

        if (carsInfo.length > 0) {
            console.log( car.UUID + ' already exists.' );
        } else {
            let newCar = {
                ...car,
                CreateDate: moment().format('MMMM Do YYYY, h:mm:ss a'),
                UpdateDate: moment().format('MMMM Do YYYY, h:mm:ss a')
            };

            db.createCar(newCar);
        }
    });
}

module.exports = {
    createCar,
    getCars,
    getCar,
    updateCar,
    deleteCar,
    uploadFile
}
