import { Migration } from '@mikro-orm/migrations';

export class Migration20250212075953 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "blog" add column if not exists "thumbnail_image2" text null, add column if not exists "thumbnail_image3" text null;`);
    this.addSql(`alter table if exists "blog" rename column "thumbnail_image" to "thumbnail_image1";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "blog" drop column if exists "thumbnail_image2", drop column if exists "thumbnail_image3";`);

    this.addSql(`alter table if exists "blog" rename column "thumbnail_image1" to "thumbnail_image";`);
  }

}
