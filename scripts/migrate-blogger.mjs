import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const feedPath = process.argv[2] ?? '/tmp/iamjuliand-feed.json';
const feed = JSON.parse(await readFile(feedPath, 'utf8'));
const entries = feed.feed.entry ?? [];

const textContent = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

const yamlString = (value) => JSON.stringify(value ?? '');

for (const entry of entries) {
  const originalUrl = entry.link.find((link) => link.rel === 'alternate').href;
  const url = new URL(originalUrl);
  const match = url.pathname.match(/^\/(\d{4})\/(\d{2})\/(.+)\.html$/);
  if (!match) throw new Error(`Unexpected post URL: ${originalUrl}`);

  const [, year, month, slug] = match;
  const title = entry.title?.$t ?? '';
  const content = entry.content?.$t ?? '';
  const description = textContent(content).slice(0, 240);
  const tags = (entry.category ?? []).map((category) => category.term);
  const author = entry.author?.[0]?.name?.$t ?? '';
  const bloggerId = entry.id?.$t?.split('.post-').at(-1) ?? '';
  const comments = Number(entry['thr$total']?.$t ?? 0);
  const imageDir = path.join('public', 'assets', 'blog', year, month, slug);
  let rewrittenContent = content;
  const imageUrls = [
    ...new Set(
      [...content.matchAll(/<img[^>]+src=["']([^"']+)/gi)].map(
        (image) => image[1],
      ),
    ),
  ];
  const localImages = [];

  await mkdir(imageDir, { recursive: true });
  for (const [index, source] of imageUrls.entries()) {
    const normalizedSource = source.startsWith('//') ? `https:${source}` : source;
    const sourceUrl = new URL(normalizedSource);
    const extension =
      path.extname(sourceUrl.pathname).match(/^\.[a-zA-Z0-9]{2,5}$/)?.[0] ??
      '.jpg';
    const filename = `${String(index + 1).padStart(2, '0')}${extension}`;
    const publicPath = `/assets/blog/${year}/${month}/${slug}/${filename}`;
    const response = await fetch(normalizedSource);
    if (!response.ok) {
      throw new Error(`Could not download ${normalizedSource}: ${response.status}`);
    }
    await writeFile(
      path.join(imageDir, filename),
      Buffer.from(await response.arrayBuffer()),
    );
    rewrittenContent = rewrittenContent.split(source).join(publicPath);
    localImages.push(publicPath);
  }

  const frontmatter = [
    '---',
    `title: ${yamlString(title)}`,
    `description: ${yamlString(description)}`,
    `pubDate: ${yamlString(entry.published?.$t)}`,
    `updatedDate: ${yamlString(entry.updated?.$t)}`,
    `author: ${yamlString(author)}`,
    `tags: ${JSON.stringify(tags)}`,
    `originalUrl: ${yamlString(originalUrl)}`,
    `bloggerId: ${yamlString(bloggerId)}`,
    `commentsCount: ${comments}`,
    `images: ${JSON.stringify(localImages)}`,
    ...(localImages.length
      ? [`imgSrc: ${yamlString(localImages[0])}`, `imgAlt: ${yamlString(title)}`]
      : []),
    '---',
    '',
  ].join('\n');
  const targetDir = path.join('src', 'pages', 'posts', year, month);
  await mkdir(targetDir, { recursive: true });
  await writeFile(
    path.join(targetDir, `${slug}.md`),
    `${frontmatter}${rewrittenContent}\n`,
  );
}

console.log(`Migrated ${entries.length} Blogger posts.`);
