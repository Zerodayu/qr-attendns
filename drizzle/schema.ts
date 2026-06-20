import { pgTable, text, uuid, json } from 'drizzle-orm/pg-core';

export const pushSubscription = pgTable('PushSubscription', {
  id: uuid('id').primaryKey().defaultRandom(),
  endpoint: text('endpoint').unique().notNull(),
  keys: json('keys').$type<{ p256dh: string; auth: string }>().notNull(),
});
