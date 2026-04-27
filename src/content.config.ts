import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const portfolio = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/_*.md'], base: './src/content/portfolio' }),
  schema: z.object({
    // ── Index card ──
    client: z.string(),
    sector: z.enum(['E-commerce', 'Automatisation', 'IA', 'Data', 'Side project']),
    tags: z.array(z.enum(['E-commerce', 'Automatisation', 'IA', 'Data'])),
    workflow: z.string(),                       // ex: "Système chèques cadeaux"
    metric: z.string(),                         // ex: "50→350"
    unit: z.string(),                           // ex: "magasins déployés"
    context: z.string(),                        // ex: "20K → 150K chèques/mois · 2 ETP → 1j/sem"
    tone: z.enum(['ink', 'paper']).default('paper'),
    featured: z.boolean().default(false),
    order: z.number().default(100),             // tri index, plus petit = premier
    draft: z.boolean().default(false),

    // ── Fiche détaillée (optionnelle : si absente, la fiche n'est pas générée) ──
    detail: z
      .object({
        period: z.string(),                     // ex: "2018 → 2024"
        hero: z.object({
          titleBefore: z.string(),
          titleAccent: z.string(),
          titleAfter: z.string().default(''),
          subtitle: z.string(),
        }),
        challenge: z.object({
          title: z.string(),
          paragraphs: z.array(z.string()),
          metrics: z
            .array(
              z.object({
                label: z.string(),
                value: z.string(),
              })
            )
            .default([]),
        }),
        build: z.object({
          title: z.string(),
          intro: z.string(),
          steps: z.array(
            z.object({
              n: z.string(),
              t: z.string(),
              d: z.string(),
            })
          ),
          architecture: z
            .object({
              eyebrow: z.string().default('Architecture · vue simplifiée'),
              blocks: z.array(
                z.object({
                  t: z.string(),
                  d: z.string(),
                })
              ),
            })
            .optional(),
        }),
        stack: z.array(z.string()),
        results: z.object({
          title: z.string(),
          items: z.array(
            z.object({
              label: z.string(),
              before: z.string(),
              after: z.string(),
              accent: z.boolean().default(false),
            })
          ),
          quote: z
            .object({
              eyebrow: z.string(),
              text: z.string(),
            })
            .optional(),
        }),
      })
      .optional(),
  }),
});

export const collections = { portfolio };
