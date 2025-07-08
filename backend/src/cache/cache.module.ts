import { Module } from '@nestjs/common';
import { Cacheable } from 'cacheable';
import { createKeyv } from '@keyv/redis';
import { CacheService } from './cache.service';

@Module({
  providers: [
    {
      provide: 'CACHE_INSTANCE',
      useFactory: async () => {
        try {
          const secondary = createKeyv('redis://localhost:6379');
          await secondary.set('test', 'test' + new Date().toString()); // Test connection
          return new Cacheable({ secondary, ttl: '8h' });
        } catch (error) {
          throw new Error(`Failed to initialize cache: ${error.message}`);
        }
      },
    },
    CacheService,
  ],
  exports: [CacheService],
})
export class CacheModule {}
