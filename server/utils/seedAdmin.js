const User = require('../models/User');

/**
 * Seeds the admin user from environment variables.
 * - Creates admin if not exists.
 * - Updates admin password/email if ADMIN_EMAIL changed.
 * - Ensures NO other user can have admin role.
 */
const seedAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set in .env — skipping admin seed');
    return;
  }

  try {
    // Strip admin role from any account that is NOT the admin email
    await User.updateMany(
      { email: { $ne: adminEmail.toLowerCase() }, role: 'admin' },
      { $set: { role: 'user' } }
    );

    // Check if admin user exists
    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() }).select('+password');

    if (existingAdmin) {
      // Ensure role stays admin
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Admin role restored for:', adminEmail);
      } else {
        console.log('✅ Admin user already exists:', adminEmail);
      }
    } else {
      // Create fresh admin
      await User.create({
        name: 'Admin',
        email: adminEmail.toLowerCase(),
        password: adminPassword,
        role: 'admin',
      });
      console.log('✅ Admin user created:', adminEmail);
    }
  } catch (err) {
    console.error('❌ Admin seed error:', err.message);
  }
};

module.exports = seedAdmin;
