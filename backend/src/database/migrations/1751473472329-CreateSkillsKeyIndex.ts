/* import { Subscription } from 'src/subscription/subscription.entity';
import {
  Collection,
  FindCursor,
  MigrationInterface,
  QueryRunner,
} from 'typeorm';
import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner';
import 'dotenv/config';
export class CreateSkillsKeyIndex1751473472329 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const mongoRunner = queryRunner as MongoQueryRunner;
    const collection = mongoRunner.databaseConnection
      .db(process.env.DB_DATABASE)
      .collection('subscription');
    const cursor: FindCursor<any> = collection.find({
      skillsKey: { $exists: false },
    });
    while (await cursor?.hasNext()) {
      const subscription = await cursor.next();

      if (!subscription.skills || typeof subscription.available !== 'boolean')
        continue;

      const skillsKey =
        [...subscription.skills].sort().join(',') +
        '|' +
        subscription.available;

      await collection.updateOne(
        { _id: subscription._id },
        { $set: { skillsKey } },
      );
    }

    // Create unique index
    await collection.createIndex({ skillsKey: 1 }, { unique: true });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const mongoRunner = queryRunner as MongoQueryRunner;
    const collection = mongoRunner.databaseConnection
      .db()
      .collection('subscription');

    // Drop index
    await collection.dropIndex('skillsKey_1');
  }
} */
