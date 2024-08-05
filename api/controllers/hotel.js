import Hotel from "../models/Hotel.js"

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
