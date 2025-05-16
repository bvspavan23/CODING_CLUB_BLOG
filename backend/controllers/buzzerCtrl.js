const asyncHandler = require("express-async-handler");
const { customAlphabet } = require("nanoid");
const Buzz = require("../model/Buzz");
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 6);

const buzzCtrl = {
  create: asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) {
      throw new Error("Please enter the Name!");
    }
    const shortedRoomId = nanoid();
    const dbRoom = await Buzz.create({
      name,
      roomId: shortedRoomId,
    });
    res.json({
      name: dbRoom.name,
      roomId: dbRoom.roomId,
      id: dbRoom._id,
    });
  }),
  getAll: asyncHandler(async (req, res) => {
    const rooms = await Buzz.find();
    res.json(rooms);
  }),
  deleteBuzz: asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const delRoom = await Buzz.findOne({ roomId });
    if (!delRoom) {
      return res.status(404).json({ message: "Room not found" });
    }
    await Buzz.findByIdAndDelete(delRoom._id);
    res.json({ message: "Room deleted successfully" });
  }),
};
module.exports = buzzCtrl;
