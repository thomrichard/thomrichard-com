# Portfolio — comment ça marche

Ce dossier contient un fichier `.md` par cas client. Chaque fichier devient
automatiquement une carte sur `/portfolio` et — si tu remplis le bloc `detail:` —
une fiche complète sur `/portfolio/[nom-du-fichier]`.

Préfixe `_` = fichier ignoré par le site (utilisé pour ce README et le template).

---

## Ajouter un nouveau cas

```bash
cd src/content/portfolio
cp _template.md mon-projet.md
```

- Le **nom du fichier** devient l'URL : `mon-projet.md` → `/portfolio/mon-projet/`
- Préfère **kebab-case sans accents** (ex : `leroy-merlin`, pas `Leroy_Merlin`)
- Édite `mon-projet.md`, sauvegarde, c'est en ligne au prochain build

---

## Carte seule vs fiche complète

C'est le bloc `detail:` dans le frontmatter qui décide :

| Configuration                  | Comportement                                    |
| ------------------------------ | ----------------------------------------------- |
| Pas de bloc `detail:`          | Carte sur l'index uniquement, mention "Bientôt" |
| Bloc `detail:` présent         | Carte cliquable + page `/portfolio/[slug]` générée |

C'est volontaire : ça permet de **teaser un cas dans la grille avant d'écrire la fiche détaillée**.

---

## Transformer un stub en fiche complète

Pour passer un cas (ex : Leroy Merlin) de "Bientôt" à fiche cliquable :

1. Ouvre le fichier (`leroy-merlin.md`)
2. Copie le bloc `detail:` complet depuis `_template.md` (ou depuis `neocarte.md` qui est l'exemple le plus complet)
3. Colle-le après le dernier champ existant (souvent `order: X`), avant le `---` de fermeture
4. Remplis les champs avec les vraies données du projet
5. Sauvegarde → `/portfolio/leroy-merlin` est générée au prochain build

---

## Dev server local — gotcha

Si tu ajoutes un nouveau fichier `.md` pendant que `npm run dev` tourne, il
n'apparaît pas toujours immédiatement (le hot-reload sur les **ajouts** de
collection est capricieux).

Solution : `Ctrl+C` dans le terminal qui fait tourner le dev, puis `npm run dev`.

Les **modifications** de fichiers existants se rechargent toutes seules.

Une fois le site déployé en prod, ce souci disparaît : chaque déploiement
relance un build complet qui scanne tout le dossier.

---

## Champs obligatoires (carte de l'index)

Tous ces champs sont **requis** sinon le build échoue avec une erreur de
schéma claire :

- `client` — nom de la marque/entreprise
- `sector` — un parmi : `E-commerce`, `Automatisation`, `IA`, `Data`, `Side project`
- `tags` — au moins 1 parmi : `E-commerce`, `Automatisation`, `IA`, `Data`
- `workflow` — titre court de ce qui a été construit
- `metric` — chiffre choc affiché en gros
- `unit` — unité du chiffre
- `context` — 1 ligne de précision
- `tone` — `paper` (carte blanche) ou `ink` (carte noire — max 1 sur la grille pour le cas phare)

Champs optionnels avec défaut :

- `featured` — `true` ajoute le badge "★ Cas phare" (max 1 par cohérence)
- `order` — tri de l'index, plus petit = premier (Néocarte = 1)
- `draft` — `true` exclut le cas du site (utile pour brouillons)

---

## Schéma technique

Si tu veux modifier le schéma (ajouter un champ, changer un enum), c'est dans
`src/content.config.ts`. TypeScript te criera dessus si un fichier ne respecte
plus le schéma — pratique pour repérer les cas à mettre à jour.

---

## Rappel des fichiers utilitaires de ce dossier

- `_template.md` — modèle commenté à dupliquer pour créer un nouveau cas
- `_README.md` — ce fichier
- Tous les autres `*.md` — cas réels, publiés sur le site
