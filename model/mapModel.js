import db from '../utils/db.js';

export const getAnimals = async () => {

  const animals = await db("animals")
    .leftJoin("animal_status", "animals.id", "animal_status.animal_id")
    .select(
      "animals.id",
      "animals.name",
      "animals.map_x",
      "animals.map_y",
      "animal_status.status"
    );

  return animals;
};