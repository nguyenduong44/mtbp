import { supabase } from "../supabase-client";

export async function loader() {
  const { data: projects } = await supabase.from("projects").select("slug");

  const urls = projects
    ?.map(
      (p) => `
      <url>
        <loc>https://mtbp.vn/du-an/${p.slug}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://mtbp.vn/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
    <url>
      <loc>https://mtbp.vn/du-an</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>https://mtbp.vn/ve-chung-toi</loc>
      <changefreq>monthly</changefreq>
      <priority>0.5</priority>
    </url>
    <url>
      <loc>https://mtbp.vn/lien-he</loc>
      <changefreq>monthly</changefreq>
      <priority>0.5</priority>
    </url>
    <url>
      <loc>https://mtbp.vn/giai-phap</loc>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>
    <url>
      <loc>https://mtbp.vn/tuyen-dung</loc>
      <changefreq>monthly</changefreq>
      <priority>0.3</priority>
    </url>
    ${urls}
    </urlset>
  `;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
