---
client: "Néocarte (RONA)"
sector: "E-commerce"
tags: ["Automatisation", "Data"]
workflow: "Système chèques cadeaux"
metric: "50→350"
unit: "magasins déployés"
context: "20K → 150K chèques/mois · 2 ETP → 1j/sem"
tone: "ink"
featured: true
order: 1

detail:
  period: "2018 → 2024"
  hero:
    titleBefore: "Industrialiser un système de chèques cadeaux pour passer de 50 à"
    titleAccent: "350 magasins"
    titleAfter: "."
    subtitle: "Un programme historique géré à la main. 50 magasins, 2 ETP, des feuilles Excel partout. Mission : tenir 7× le volume sans embaucher."

  challenge:
    title: "Un programme à la main qui ne peut pas suivre la croissance."
    paragraphs:
      - "En 2018, Néocarte traitait 20 000 chèques cadeaux par mois sur 50 magasins. Les commandes arrivaient par mail, étaient saisies dans un Excel, validées à la main, expédiées via une étiquette imprimée une à une. Deux personnes à temps plein, et déjà des erreurs."
      - "Le management voulait étendre à 350 magasins en 24 mois. Avec la même équipe. Sans casser la qualité."
    metrics:
      - { label: "Volume initial", value: "20K / mois" }
      - { label: "Magasins", value: "50" }
      - { label: "Équipe", value: "2 ETP" }

  build:
    title: "Une refonte progressive en 5 chantiers, déployés sans interruption de service."
    intro: "Pas de big bang. À chaque chantier, on validait sur 3 magasins pilotes avant de généraliser."
    steps:
      - n: "01"
        t: "Cartographie du process"
        d: "3 jours d'observation terrain. J'ai documenté chaque étape, chaque exception, chaque cas tordu — 47 au total."
      - n: "02"
        t: "Refonte autour d'Airtable"
        d: "Une base unique pour les commandes, magasins, statuts. Plus d'Excel partagés. Plus de double-saisie."
      - n: "03"
        t: "Automatisations Make"
        d: "12 scénarios : ingestion mails → création commande → validation → impression étiquette → tracking → reporting."
      - n: "04"
        t: "Interface magasin"
        d: "Une app WeWeb minimaliste pour les responsables magasin : je commande, je vois le statut, je n'appelle plus le siège."
      - n: "05"
        t: "Reporting auto"
        d: "Tableau de bord temps réel + rapports mensuels en PDF, envoyés automatiquement aux directeurs régionaux."
    architecture:
      blocks:
        - { t: "Magasin", d: "WeWeb" }
        - { t: "Make", d: "Orchestration" }
        - { t: "Airtable", d: "Source de vérité" }
        - { t: "Imprimerie", d: "API étiquettes" }
        - { t: "Reporting", d: "PDF auto" }

  stack: ["Make", "Airtable", "WeWeb", "Claude API", "Gmail API", "Stripe"]

  results:
    title: "24 mois plus tard. Avec la même équipe. Sans incident majeur."
    items:
      - { label: "Couverture",     before: "50 magasins",  after: "350 magasins",  accent: true }
      - { label: "Volume chèques", before: "20K / mois",   after: "150K / mois" }
      - { label: "Charge équipe",  before: "2 ETP",        after: "1 jour / sem." }
    quote:
      eyebrow: "Ce que ça a changé pour le siège"
      text: "« On a multiplié le périmètre par 7 sans toucher aux effectifs. Et on a libéré l'équipe historique pour piloter le programme — au lieu de le subir. »"
---

<!-- Espace libre : notes additionnelles, FAQ, anecdotes, etc. seront rendues sous les sections structurées si tu en ajoutes ici. -->
