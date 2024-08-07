import { faker } from '@faker-js/faker'; 

import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { createError } from "../utils/error.js";

// CREATE
export const createRoom = async (req,res,next) => {
    const hotelId = req.params.hotelid;
    const newRoom = new Room(req.body);
    try {
        const savedRoom = await newRoom.save();
        try {
            await Hotel.findByIdAndUpdate(
                hotelId, 
                {
                    $push: { rooms: savedRoom._id },
                }
            );
        } catch (err) {
            next(err);    
        }
        res.status(200).json(savedRoom);
    } catch (err) {
        next(err);
    }

}

// UPDATE
export const updateRoom = async (req,res,next) => {
    const updateRoom = await Room.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true}
    ); 
    try {
        // Responder con el Room guardado
        res.status(200).json(updateRoom);
    } catch (err) {
        // Manejar errores
        next(err);
    }
 }

// DELETE
export const deleteRoom = async (req,res,next) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return next(createError(404, "Room not found!"));

        await Hotel.updateMany(
            { rooms: room._id },
            { $pull: { rooms: room._id } }
        );

        await Room.findByIdAndDelete(req.params.id);
        res.status(200).json('Room has been deleted.');
    } catch (err) {
        next(err);
    }
 }

 // Dellete All Rooms
export const deleteAllRooms = async (req, res, next) => {
    try {
        await Room.deleteMany();
        await Hotel.updateMany({}, { $unset: { rooms: "" } });
        res.status(200).json('All rooms and their references in hotels have been deleted.');
    } catch (err) {
        next(err);
    }
};

// GET
export const getRoom = async (req,res,next) => {
    const getRoom = await Room.findById(
        req.params.id
    ); 
    try {
        // Responder con el Room guardado
        res.status(200).json(getRoom);
    } catch (err) {
        // Manejar errores
        next(err);
    }
 }
// GET ALL
export const room = async (req,res,next) => {
    const room = await Room.find();
    try {        
        // Responder con el Room guardado
        res.status(200).json(room);
    } catch (err) {
        // Manejar errores
        next(err);
    }
}

// Fake Rooms - Only to Test
export const insertFakeRooms = async (req, res, next) => {
    const numRooms = req.params.num || 10; // Número de habitaciones a insertar
    try {
        // Obtener todos los hoteles
        const hotels = await Hotel.find();
        if (hotels.length === 0) {
            return res.status(404).json("No hotels found to assign rooms.");
        }

        const fakeRooms = [];
        const updatedHotels = new Set();

        for (let i = 0; i < numRooms; i++) {
            const randomHotel = hotels[Math.floor(Math.random() * hotels.length)];
            const newRoom = new Room({
                title: faker.commerce.productName(),
                price: faker.number.int({ min: 50, max: 500 }),
                maxPeople: faker.number.int({ min: 1, max: 10 }),
                desc: faker.lorem.sentences(),
                roomNumbers: [
                    {
                        number: faker.number.int({ min: 100, max: 999 }),
                        unavailableDates: [
                            faker.date.past(),
                            faker.date.future()
                        ]
                    },
                    {
                        number: faker.number.int({ min: 100, max: 999 }),
                        unavailableDates: [
                            faker.date.past(),
                            faker.date.future()
                        ]
                    }
                ]
            });
            const savedRoom = await newRoom.save();
            randomHotel.rooms.push(savedRoom._id);
            await randomHotel.save();
            fakeRooms.push(savedRoom);
            updatedHotels.add(randomHotel._id);
        }

        res.status(200).json({
            message: `Inserted ${numRooms} fake rooms and updated corresponding hotels`,
            //rooms: fakeRooms,
            updatedHotels: Array.from(updatedHotels)
        });

    } catch (err) {
        next(err);
    }
};

