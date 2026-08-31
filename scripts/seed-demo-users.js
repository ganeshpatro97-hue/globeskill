const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const envVars = {};
env.split('\n').forEach(line => {
  const parts = line.trim().split('=');
  const k = parts[0];
  const v = parts.slice(1).join('=');
  if (k && v) envVars[k.trim()] = v.trim().replace(/^["']|["']$/g, '');
});

const url = envVars.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

const client = createClient(url, anonKey);
const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

async function testRoles() {
  console.log('Testing creating/updating different role accounts...');

  const roles = [
    { email: 'student.rohit@globeskill.org', name: 'Rohit Kumar (Student)', role: 'student' },
    { email: 'trainer.priya@globeskill.org', name: 'Priya Patel (Lead Instructor)', role: 'trainer' },
    { email: 'donor.vikram@techgives.org', name: 'Vikram Malhotra (Global Funder)', role: 'donor' },
    { email: 'admin@globeskill.org', name: 'Aarav Sharma (Admin)', role: 'admin' },
  ];

  for (const acc of roles) {
    console.log(`\n--- Setting up ${acc.role}: ${acc.email} ---`);
    // Check if user exists in auth
    const { data: list } = await admin.auth.admin.listUsers();
    const existing = list.users.find(u => u.email.toLowerCase() === acc.email.toLowerCase());

    let userId = existing?.id;
    if (!existing) {
      const { data: created, error: cErr } = await admin.auth.admin.createUser({
        email: acc.email,
        password: 'GlobeSkillPass@2026',
        email_confirm: true,
        user_metadata: {
          full_name: acc.name,
          user_role: acc.role
        }
      });
      if (cErr) {
        console.log('Create error:', cErr.message);
      } else {
        userId = created.user.id;
        console.log('Created user:', userId);
      }
    } else {
      console.log('User already exists:', userId);
      await admin.auth.admin.updateUserById(userId, {
        password: 'GlobeSkillPass@2026',
        user_metadata: {
          full_name: acc.name,
          user_role: acc.role
        }
      });
      console.log('Updated user password and metadata');
    }

    if (userId) {
      // Ensure profile row exists in public.profiles with correct role
      const { data: prof, error: pErr } = await admin.from('profiles').upsert({
        id: userId,
        email: acc.email,
        full_name: acc.name,
        user_role: acc.role,
        location: 'India',
        education_background: 'GlobeSkill Educator/Learner/Partner',
        updated_at: new Date().toISOString()
      }).select();

      if (pErr) {
        console.log('Profile upsert error:', pErr.message);
      } else {
        console.log('Profile upserted:', prof);
      }
    }

    // Now test logging in as this user with anon client!
    const { data: loginData, error: lErr } = await client.auth.signInWithPassword({
      email: acc.email,
      password: 'GlobeSkillPass@2026'
    });
    if (lErr) {
      console.log('Login failed for', acc.email, ':', lErr.message);
    } else {
      console.log('Login SUCCESS for', acc.email, '! User ID:', loginData.user.id);
    }
  }
}

testRoles();
