import db from '../utils/db.js';

function formatAnimalRecord(record) {
  return {
    id: record.id,
    name: record.name || 'Chua cap nhat',
    family: record.family || 'Khong ro',

    description: record.description || 'Chua co mo ta',
    distribution: record.distribution || '',
    ecology: record.ecology || '',
    diet: record.diet || '',
    reproduction: record.reproduction || '',
    fun_fact: record.fun_fact || '',
    conservationStatus: record.conservation_status || '',
    status: record.status || 'Hoạt động',
    feedingTime: record.feeding_time,
    activeTime: record.active_time,
    imageUrl:
      record.image_url ||
      'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7',

    zone: record.zone,
    mapX: record.map_x,
    mapY: record.map_y,
    
  };
}

/**
 * Lấy tất cả animals
 */
export async function findAll() {
  const rows = await db('animal')
    .select('*')
    .orderBy('id', 'asc');

  return rows.map(formatAnimalRecord);
}

/**
 * Lấy animal theo ID
 */
export async function findById(id) {
  const row = await db('animal')
    .where('id', id)
    .first();

  if (!row) return null;

  return formatAnimalRecord(row);
}

/**
 * Đếm số animals
 */
export async function countAll() {
  const result = await db('animal')
    .count('* as total')
    .first();

  return result.total;
}

/**
 * Phân trang animals
 */
export function findPage(limit, offset) {
  return db('animal')
    .select(
      'id',
      'name',
      'family',
      'image_url',
      'zone'
    )
    .orderBy('id', 'asc')
    .limit(limit)
    .offset(offset);
}