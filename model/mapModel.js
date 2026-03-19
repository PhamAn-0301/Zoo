import db from '../utils/db.js';

export const getAnimals = async () => {
  return await db("animal")
    .select(
      "id",
      "name",
      "family as species",   // dùng family làm icon
      "map_x",
      "map_y",
      "image_url",
      "feeding_time",
      "active_time",
      "status"
    );
};