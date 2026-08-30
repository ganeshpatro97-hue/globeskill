const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Read environment variables from .env.local manually
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...values] = trimmed.split('=');
        if (key && values.length) {
          process.env[key.trim()] = values.join('=').trim().replace(/^["']|["']$/g, '');
        }
      }
    });
  }
}

loadEnv();

async function runAutoMigration() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.argv[2];

  if (!connectionString) {
    console.error(`
❌ Error: No DATABASE_URL found.

👉 How to set it:
1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/mdsxviqqlctdvdbllvad
2. Click "Project Settings" (⚙️) -> "Database"
3. Under "Connection string", select "URI" (or "Nodejs")
4. Copy the URI and replace [YOUR-PASSWORD] with your database password.
5. Add it to your .env.local:
   DATABASE_URL=postgresql://postgres.mdsxviqqlctdvdbllvad:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres

6. Then run: npm run db:setup
    `);
    process.exit(1);
  }

  console.log('🚀 Connecting to Supabase PostgreSQL Database...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('✅ Connected to database successfully!\n');

    // 1. Run supabase-setup.sql
    const setupSqlPath = path.join(__dirname, '..', 'supabase-setup.sql');
    if (fs.existsSync(setupSqlPath)) {
      console.log('📄 Executing 1/2: supabase-setup.sql (Profiles, Roles, Courses, Lessons)...');
      const setupSql = fs.readFileSync(setupSqlPath, 'utf8');
      await client.query(setupSql);
      console.log('✅ Core schema & seed courses applied successfully!\n');
    }

    // 2. Run supabase-donations-setup.sql
    const donationSqlPath = path.join(__dirname, '..', 'supabase-donations-setup.sql');
    if (fs.existsSync(donationSqlPath)) {
      console.log('📄 Executing 2/2: supabase-donations-setup.sql (Donors, Donations, Impact Triggers)...');
      const donationSql = fs.readFileSync(donationSqlPath, 'utf8');
      await client.query(donationSql);
      console.log('✅ Donor management & financial schema applied successfully!\n');
    }

    // 3. Verify tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('📊 Verified Tables in Database:');
    res.rows.forEach((r, i) => console.log(`   ${i + 1}. public.${r.table_name}`));

    console.log('\n🎉 ALL TABLES, ROLES, TRIGGERS & SEED DATA HAVE BEEN AUTOMATICALLY CREATED!');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    await client.end();
  }
}

runAutoMigration();
