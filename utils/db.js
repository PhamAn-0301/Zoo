import knex from 'knex';

const db = knex({
  client: 'pg',
  connection: {
    host: 'db.gspygwrbemidbytcuumh.supabase.co',
    port: 5432,
    user: 'postgres',
    password: 'Baoan0902727331',
    database: 'postgres',
    pool: { min: 0, max: 20 },
    ssl: { rejectUnauthorized: false }
  }
});

export default db;