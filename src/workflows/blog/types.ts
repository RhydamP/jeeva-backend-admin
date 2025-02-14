export default interface BlogRequest {
    id?: string;
    author?: string;
    tags?: string;
    seo_title?: string;
    seo_keywords?: string;
    seo_description?: string;
    url_slug?: string;
    title?: string;
    subtitle?: string;
    description?: Record<string, unknown>;
    draft: string;
    thumbnail_image1?: string;
    thumbnail_image2?: string;
    thumbnail_image3?: string;
    published_date?: string | Date;
    updated_date?: string | Date;
    social_media_meta?: Record<string, unknown>;
    canonical_url?: string;
    alt_tags?: Record<string, unknown>;
    internal_links?: Record<string, unknown>;
    external_links?: Record<string, unknown>;
  }