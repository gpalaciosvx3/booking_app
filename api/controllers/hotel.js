import { faker } from '@faker-js/faker'; 
import Hotel from "../models/Hotel.js"
import Room from "../models/Room.js"
import { createError } from "../utils/error.js";
import { famousCities } from "../utils/constants.js"; 

// CREATE
export const createHotel = async (req,res,next) => {
    const newHotel = new Hotel(req.body);
    try {       
        const savedHotel = await newHotel.save();
        res.status(200).json(savedHotel);
    } catch (err) {
        // Manejar errores
        next(err);
    }
}

// UPDATE
export const updateHotel = async (req,res,next) => {
    const updateHotel = await Hotel.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true}
    ); 
    try {
        // Responder con el hotel guardado
        res.status(200).json(updateHotel);
    } catch (err) {
        // Manejar errores
        next(err);
    }
 }

// DELETE
export const deleteHotel = async (req,res,next) => {
    try {
        await Hotel.findByIdAndDelete(
            req.params.id
        ); 
        // Responder con el hotel guardado
        res.status(200).json('Hotel has been deleted.');
    } catch (err) {
        // Manejar errores
        next(err);
    }
 }

// Dellete All Hotels
export const deleteAllHotels = async (req, res, next) => {
    try {
        await Hotel.deleteMany();
        res.status(200).json('All hotels have been deleted.');
    } catch (err) {
        next(err);
    }
};

// GET
export const getHotel = async (req,res,next) => {
    const getHotel = await Hotel.findById(
        req.params.id
    ); 
    try {
        // Responder con el hotel guardado
        res.status(200).json(getHotel);
    } catch (err) {
        // Manejar errores
        next(err);
    }
 }

// GET ALL
export const hotel = async (req,res,next) => {
    const hotel = await Hotel.find();
    try {
        // Responder con el hotel guardado
        res.status(200).json(hotel);
    } catch (err) {
        // Manejar errores
        next(err);
    }
 }

// Fake Hotels
export const insertFakeHotels = async (req, res, next) => {
    const numHotels = req.params.num || 10; // Número de hoteles a insertar
    try {
        // Obtener todas las habitaciones
        const rooms = await Room.find();                
        // if (rooms.length === 0) return next(createError(404, "No rooms found to assign to hotels!"));
        
        const usedRooms = new Set();
        const fakeHotels = [];
        //const randomRooms = [];
        for (let i = 0; i < numHotels; i++) {
            let randomRooms = [];
            if (rooms.length > 0) {
                const availableRooms = rooms.filter(room => !usedRooms.has(room._id));               
                const maxRooms = Math.min(5, availableRooms.length);
                const numRooms = maxRooms > 0 ? faker.number.int({ min: 1, max: maxRooms }) : 0;
               
                randomRooms = Array.from({ length: numRooms }, () => {
                    let room;
                    do {
                        room = availableRooms[Math.floor(Math.random() * availableRooms.length)]._id;
                    } while (usedRooms.has(room));
                    usedRooms.add(room);
                    return room;
                });
                
            }

            const newHotel = new Hotel({
                name: faker.company.name(),
                type: faker.helpers.arrayElement(['Hotels', 'Apartments', 'Resorts', 'Villas', 'Cabins']),
                city: faker.helpers.arrayElement(famousCities), // Usar ciudades famosas desde constants.js
                address: faker.location.streetAddress(),
                distance: `${faker.number.int({ min: 100, max: 2000 })}m`,
                photos: [faker.image.url(), faker.image.url(), faker.image.url()],
                title: faker.company.catchPhrase(),
                desc: faker.lorem.sentences(),
                rating: faker.number.int({ min: 0, max: 5, precision: 0.1 }),
                rooms: randomRooms,
                cheapestPrice: faker.number.int({ min: 50, max: 500 }),
                featured: faker.datatype.boolean(),
            });

            const savedHotel = await newHotel.save();
            fakeHotels.push(savedHotel);
        }

        res.status(200).json({
            message: `Inserted ${numHotels} fake hotels`,
            hotels: fakeHotels._id
        });
    } catch (err) {
        next(err);
    }
};

// COUNT BY CITIE
export const countbycitie = async (req,res,next) => {
    const cities = req.query.cities.split(",");    
    try {
        const list = await Promise.all(
            cities.map(async (city) => {
                const count = await Hotel.countDocuments({ city: { $regex: new RegExp(city, 'i') } });
                const hotel = await Hotel.findOne({ city: { $regex: new RegExp(city, 'i') } }).select("photos");
                const randomPhoto = hotel ? hotel.photos[Math.floor(Math.random() * hotel.photos.length)] : null;
                return {
                    city: city,
                    count: count,
                    image: randomPhoto
                };
            })
        );

        const result = list.reduce((acc, curr) => {
            acc[curr.city] = {
                cantidad: curr.count,
                imagen: curr.image
            };
            return acc;
        }, {});

        res.status(200).json(result);
    } catch (err) {
        // Manejar errores
        next(err);
    }
}

export const countbytype = async (req,res,next) => {
    const cities = req.query.cities.split(",");    
    try {
        const list = await Promise.all(
            cities.map(async (type) => {
                const count = await Hotel.countDocuments({ type: { $regex: new RegExp(type, 'i') } });
                const hotel = await Hotel.findOne({ type: { $regex: new RegExp(type, 'i') } }).select("photos");
                const randomPhoto = hotel ? hotel.photos[Math.floor(Math.random() * hotel.photos.length)] : null;
                return {
                    type: type,
                    count: count,
                    image: randomPhoto
                };
            })
        );

        const result = list.reduce((acc, curr) => {
            acc[curr.type] = {
                cantidad: curr.count,
                imagen: curr.image
            };
            return acc;
        }, {});

        res.status(200).json(result);
    } catch (err) {
        // Manejar errores
        next(err);
    }
}

