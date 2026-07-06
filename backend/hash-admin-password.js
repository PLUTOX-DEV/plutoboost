import bcrypt from 'bcrypt';
import { EOL } from 'os';

const password = process.argv[2];

if (!password) {
  console.error('Please provide a password to hash.');
  console.log('Usage: node hash-admin-password.js <your-new-password>');
  process.exit(1);
}

const saltRounds = 10;
bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) throw err;
  console.log(`Your new admin password hash is:${EOL}${hash}`);
  console.log(`${EOL}Copy this hash and add it to your .env file as ADMIN_PASSWORD_HASH`);
});