import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const competitions = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/competitions" }),
  schema: z.object({
    name: z.string(),
    year: z.number(),
    award: z.string(),
    image: z.string(),
    content: z.string().optional(),
    gallery: z.array(z.string()).optional(),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/gallery" }),
  schema: z.object({
    type: z.enum(["image", "video", "youtube", "vimeo"]),
    image: z.string(),
    sourceUrl: z.string().optional(),
    caption: z.string().optional(),
  }),
});

export const collections = { competitions, gallery };
