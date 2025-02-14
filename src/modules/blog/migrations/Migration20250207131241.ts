import { Migration } from '@mikro-orm/migrations';

export class Migration20250207131241 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "blog" drop constraint if exists "blog_seo_description_unique";`);
    this.addSql(`alter table if exists "blog" drop constraint if exists "blog_url_slug_unique";`);
    this.addSql(`alter table if exists "blog" drop constraint if exists "blog_seo_title_unique";`);
    this.addSql(`create table if not exists "blog" ("id" text not null, "author" text null, "tags" text[] null, "seo_title" text null, "seo_keywords" text null, "url_slug" text null, "seo_description" text null, "thumbnail_image" text null, "title" text null, "subtitle" text null, "description" jsonb null, "draft" boolean not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "blog_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_blog_seo_title_unique" ON "blog" (seo_title) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_blog_url_slug_unique" ON "blog" (url_slug) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_blog_seo_description_unique" ON "blog" (seo_description) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_blog_deleted_at" ON "blog" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "blog" cascade;`);
  }

}
