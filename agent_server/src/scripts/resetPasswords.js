const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function resetPasswords() {
  try {
    // Reset super admin password
    await User.update(
      { password: await bcrypt.hash('Admin@123', 10) },
      { where: { email: 'admin@example.com' } }
    );

    // Reset bank admin password
    await User.update(
      { password: await bcrypt.hash('Bank@123', 10) },
      { where: { email: 'bank.admin@example.com' } }
    );

    // Reset bank staff password
    await User.update(
      { password: await bcrypt.hash('Staff@123', 10) },
      { where: { email: 'bank.staff@example.com' } }
    );

    // Reset agency admin password
    await User.update(
      { password: await bcrypt.hash('Agency@123', 10) },
      { where: { email: 'agency@example.com' } }
    );

    console.log('Passwords have been reset successfully!');
    console.log('\nDefault credentials:');
    console.log('Super Admin - admin@example.com / Admin@123');
    console.log('Bank Admin - bank.admin@example.com / Bank@123');
    console.log('Bank Staff - bank.staff@example.com / Staff@123');
    console.log('Agency Admin - agency@example.com / Agency@123');

  } catch (error) {
    console.error('Error resetting passwords:', error);
  } finally {
    process.exit();
  }
}

resetPasswords();