import { Migration } from '@mikro-orm/migrations';

export class Migration20250211093107 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "blog" add column if not exists "published_date" timestamptz null, add column if not exists "updated_date" timestamptz null, add column if not exists "social_media_meta" jsonb null, add column if not exists "canonical_url" text null, add column if not exists "alt_tags" jsonb null, add column if not exists "internal_links" jsonb null, add column if not exists "external_links" jsonb null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "blog" drop column if exists "published_date", drop column if exists "updated_date", drop column if exists "social_media_meta", drop column if exists "canonical_url", drop column if exists "alt_tags", drop column if exists "internal_links", drop column if exists "external_links";`);
  }

}
