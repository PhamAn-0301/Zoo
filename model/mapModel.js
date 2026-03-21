import db from '../utils/db.js';

function formatMapAnimalRecord(record) {
  const mapX = Number(record.map_x ?? record.mapX);
  const mapY = Number(record.map_y ?? record.mapY);

  return {
    id: record.id,
    name: record.name || 'Chua cap nhat',
    species: record.family || record.species || 'Khong ro',
    zone: record.zone ?? record.khu ?? null,
    map_x: Number.isFinite(mapX) ? mapX : null,
    map_y: Number.isFinite(mapY) ? mapY : null,
    image_url: record.image_url || null,
    conservation_status: record.conservation_status || '',
    feeding_time: record.feeding_time || null,
    active_time: record.active_time || null,
    status: record.status
  };
}

export const getAnimals = async () => {
  const rows = await db('animal')
    .select(
      'id',
      'name',
      'family',
      'zone',
      'map_x',
      'map_y',
      'image_url',
      'conservation_status',
      'feeding_time',
      'active_time',
      'status'
    )
    .orderBy('id', 'asc');

  return rows.map(formatMapAnimalRecord);
};