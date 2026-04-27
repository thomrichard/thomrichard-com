---
# ──────────────────────────────────────────────────────────────────────────────
# Template fiche portfolio — tomrichard.com
# ──────────────────────────────────────────────────────────────────────────────
# Comment l'utiliser :
#   1. Dupliquer ce fichier en `mon-projet.md` (le nom de fichier devient le slug
#      → URL /portfolio/mon-projet/). Préférer kebab-case sans accents.
#   2. Le préfixe "_" du fichier _template.md le fait ignorer par le build
#      (Astro skip les fichiers commençant par "_"), donc ce template ne s'affiche
#      jamais sur le site — il sert uniquement de modèle.
#   3. Remplir les champs ci-dessous. Tous les champs sans default sont OBLIGATOIRES.
#   4. Si tu ne remplis PAS le bloc `detail:`, le cas apparaît dans la grille
#      `/portfolio` mais la fiche détaillée n'est pas générée (lien désactivé,
#      mention "Bientôt"). Pratique pour tease un cas avant de l'écrire.
#   5. Tester en local : `npm run dev` puis ouvrir /portfolio/mon-projet
# ──────────────────────────────────────────────────────────────────────────────

# ===== Carte de l'index (grille /portfolio) =====
client: "Nom du client"                       # ex: "Néocarte (RONA)"
sector: "E-commerce"                          # E-commerce | Automatisation | IA | Data | Side project
tags: ["Automatisation", "Data"]              # 1+ parmi : E-commerce | Automatisation | IA | Data
workflow: "Système de chèques cadeaux"        # Le titre court de ce que tu as construit
metric: "50→350"                              # Le chiffre choc affiché en gros sur la carte
unit: "magasins déployés"                     # L'unité du chiffre, en mono caps
context: "20K → 150K chèques/mois · 2 ETP → 1j/sem"  # 1 ligne de précision
tone: "paper"                                 # paper | ink — "ink" = carte fond noir (1 max sur la grille)
featured: false                               # true = badge "★ Cas phare" dans le coin
order: 100                                    # tri de l'index, plus petit = premier (Néocarte = 1)
draft: false                                  # true = exclu du site (utile pour brouillons)

# ===== Fiche détaillée /portfolio/[slug] (optionnel) =====
# Supprime tout le bloc `detail:` ci-dessous si tu veux UNIQUEMENT publier la carte.
detail:
  period: "2018 → 2024"                       # Période d'intervention, affichée en eyebrow

  hero:
    # Le titre est éclaté en 3 morceaux pour permettre la mise en accent (teal) du milieu.
    titleBefore: "Industrialiser un système de chèques cadeaux pour passer de 50 à"
    titleAccent: "350 magasins"               # Cette portion sort en couleur d'accent
    titleAfter: "."                           # Souvent juste un point final, parfois vide ""
    subtitle: "Une à deux phrases qui posent le décor : où on partait, ce qu'il fallait tenir."

  # 01 · Le défi
  challenge:
    title: "Une phrase qui résume le problème de fond."
    paragraphs:
      - "Premier paragraphe : le contexte initial, les chiffres de départ, ce qui coinçait."
      - "Deuxième paragraphe (optionnel) : l'ambition, la contrainte, l'objectif fixé."
    metrics:
      # 0 à 3 métriques "avant" — petites cards grises sous le texte. Vide = section masquée.
      - { label: "Volume initial", value: "20K / mois" }
      - { label: "Magasins",       value: "50" }
      - { label: "Équipe",         value: "2 ETP" }

  # 02 · Ce que j'ai construit
  build:
    title: "Une phrase qui explique l'approche (progressive ? big bang ? en X chantiers ?)."
    intro: "Une phrase de méthode (comment c'était cadré, validé, déployé)."
    steps:
      # Liste numérotée des chantiers — généralement 3 à 6 étapes.
      - n: "01"
        t: "Titre court du chantier"
        d: "Description en 1-2 phrases : ce que tu as fait concrètement."
      - n: "02"
        t: "Deuxième chantier"
        d: "Idem."
      - n: "03"
        t: "Troisième chantier"
        d: "Idem."
    architecture:
      # Optionnel : diagramme schématique 5 blocs (ou autre nb). Supprime le bloc si pas pertinent.
      eyebrow: "Architecture · vue simplifiée"
      blocks:
        - { t: "Composant 1", d: "Rôle" }
        - { t: "Composant 2", d: "Rôle" }
        - { t: "Composant 3", d: "Rôle" }
        - { t: "Composant 4", d: "Rôle" }
        - { t: "Composant 5", d: "Rôle" }

  # 03 · Stack
  stack: ["Make", "Airtable", "WeWeb", "Claude API"]   # Liste libre des outils utilisés

  # 04 · Résultats
  results:
    title: "Une phrase qui ancre le résultat dans le temps et les conditions."
    items:
      # 1 à 3 cards avant/après. `accent: true` = card amber (max 1, pour le résultat phare).
      - { label: "Couverture",      before: "50 magasins", after: "350 magasins", accent: true }
      - { label: "Volume",          before: "20K / mois",  after: "150K / mois" }
      - { label: "Charge équipe",   before: "2 ETP",       after: "1 jour / sem." }
    quote:
      # Optionnel : citation client en bas de la section Résultats. Supprime si pas dispo.
      eyebrow: "Ce que ça a changé pour le siège"
      text: "« Une citation client qui parle d'impact business, pas de technique. »"
---

<!--
  Tout ce qui est en dessous du frontmatter est du markdown libre, rendu en bas
  de la fiche détaillée (sous "Résultats", avant "Autres cas").

  Bon endroit pour :
    - Notes additionnelles, anecdotes, post-mortem
    - FAQ ("Pourquoi Make et pas Zapier ?")
    - Liens vers articles de blog / vidéos / templates
    - Précisions techniques pour les lecteurs curieux

  Si tu n'as rien à ajouter, laisse cette section vide — elle ne sera pas rendue.
-->
