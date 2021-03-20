const knex = require('./knex');


const createCar = async(car) => {
    return await knex('cars').insert(car);
};

const getCar = (UUID) => {
    return knex('cars').where('UUID', UUID).select('*');
}

const getAllCars = async() => {
    return await knex('cars').select('*');
}

const deleteCar = async(UUID) => {
    return await knex('cars').where('UUID', UUID).del();
}

const updateCar = async(UUID, car) => {
    return await knex('cars').where('UUID', UUID).update(car);
}

module.exports = {
    createCar,
    getCar,
    getAllCars,
    deleteCar,
    updateCar
}
