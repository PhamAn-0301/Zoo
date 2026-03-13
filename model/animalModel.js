import db from '../utils/db.js';

function formatAnimalRecord(record) {
  return {
    id: record.id,
    name: record.name || 'Chua cap nhat',
    species: record.species || 'Khong ro',
    age: record.age,
    gender: record.gender || 'Khong ro',
    description: record.description || 'Chua co mo ta',
    imageUrl:
      record.image_url ||
      'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7',
    zoneId: record.zone_id,
    zoneName: record.zone_name || `Khu ${record.zone_id}`,
    mapX: record.map_x,
    mapY: record.map_y
  };
}

/**
 Lấy tất cả animals
 */
export async function findAll() {
  const rows = await db('animals as a')
    .leftJoin('zones as z', 'a.zone_id', 'z.id')
    .select(
      'a.id',
      'a.name',
      'a.species',
      'a.age',
      'a.gender',
      'a.description',
      'a.image_url',
      'a.zone_id',
      'a.map_x',
      'a.map_y',
      'z.name as zone_name'
    )
    .orderBy('a.id', 'asc');

  return rows.map(formatAnimalRecord);
}

/**
 Lấy animal theo ID
 */
export async function findById(id) {
  const row = await db('animals as a')
    .leftJoin('zones as z', 'a.zone_id', 'z.id')
    .select(
      'a.*',
      'z.name as zone_name'
    )
    .where('a.id', id)
    .first();

  if (!row) return null;

  return formatAnimalRecord(row);
}

/**
 Đếm số animals
 */
export async function countAll() {
  const result = await db('animals')
    .count('* as total')
    .first();

  return result.total;
}

/**
 Phân trang animals
 */
export function findPage(limit, offset) {
  return db('animals as a')
    .leftJoin('zones as z', 'a.zone_id', 'z.id')
    .select(
      'a.id',
      'a.name',
      'a.species',
      'a.image_url',
      'z.name as zone_name'
    )
    .orderBy('a.id', 'asc')
    .limit(limit)
    .offset(offset);
}