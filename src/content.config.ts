import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

const journalSchema = z.object({
  title: z.string(),
  updated: z.coerce.date(),
  type: z.string(),
  category: z.union([z.string(), z.array(z.string())]),
  tags: z.array(z.string()).default([]),
  description: z.string(),
  heroImage: z.string().optional(),
  project: z.string().optional(),
  featured: z.boolean().default(false),
});

export const collections = {
  writing: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
    schema: journalSchema,
  }),
  projects: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
    schema: journalSchema,
  }),
  notes: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
    schema: journalSchema,
  }),
};
