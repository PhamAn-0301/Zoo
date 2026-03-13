import db from '../utils/db.js';

export const getAnimals = async () => {
  return await db("animals")
    .leftJoin("animal_status", "animals.id", "animal_status.animal_id")
    .select(
      "animals.id",
      "animals.name",
      "animals.species", // Thêm cột này để icon hiển thị đúng 🐯🐘
      "animals.map_x",
      "animals.map_y",
      "animal_status.status"
    );
};