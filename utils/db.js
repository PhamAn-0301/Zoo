import knex from 'knex';

const db = knex({
  client: 'pg',
  connection: {
    host: 'aws-1-ap-south-1.pooler.supabase.com',
    port: 5432,
    user: 'postgres.gspygwrbemidbytcuumh',
    password: 'Baoan0902727331',
    database: 'postgres',
    pool: { min: 0, max: 20 },
    ssl: { rejectUnauthorized: false }
  }
});

export default db;