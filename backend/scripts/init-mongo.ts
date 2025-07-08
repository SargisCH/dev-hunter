import { MongoClient } from 'mongodb';
import 'dotenv/config';

async function prepareDb() {
  const adminUri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/`;
  const username = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_DATABASE;

  if (!adminUri || !username || !password || !database) {
    console.error(
      'Please set MONGO_ADMIN_URI, MONGO_APP_USER, MONGO_APP_PASS, MONGO_APP_DB in your .env file',
    );
    process.exit(1);
  }

  const client = new MongoClient(adminUri);

  try {
    await client.connect();
    const adminDb = client.db('admin');

    const usersInfo = await adminDb.command({ usersInfo: username });
    if (usersInfo.users.length > 0) {
      console.log(`User "${username}" already exists.`);
    } else {
      await adminDb.command({
        createUser: username,
        pwd: password,
        roles: [{ role: 'readWrite', db: database }],
      });
      console.log(
        `User "${username}" created with readWrite role on "${database}".`,
      );
    }
  } catch (err) {
    console.error('Failed to prepare DB:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

prepareDb();
