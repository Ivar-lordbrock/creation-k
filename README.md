# Création K — site vitrine

Site vitrine de Création K, l'atelier de couture de Karine : sacs, pochettes et cadeaux de naissance cousus main.
L'objectif unique : donner envie, puis amener à écrire en message privé sur Instagram (`https://ig.me/m/creation.k.a`).

- 100 % statique : HTML, CSS et JavaScript « vanilla ». Pas de framework, pas de serveur, pas de build.
- Mobile d'abord, rapide : photos WebP en plusieurs tailles, chargement différé, aucune vidéo chargée depuis TikTok (simples liens).
- Aucun cookie, aucune mesure d'audience.

## Structure

```
creation-ka/
├── index.html              la page unique (accueil, à propos, créations, coulisses, contact)
├── mentions-legales.html   mentions légales (zones [À COMPLÉTER] à remplir)
├── 404.html                page « introuvable » (utilisée automatiquement par l'hébergeur)
├── css/style.css           toute la mise en forme (couleurs en haut du fichier)
├── js/main.js              menu, carrousel, filtres, agrandissement, bouton flottant
├── assets/
│   ├── fonts/              polices Fraunces et Plus Jakarta Sans (hébergées ici, sans Google)
│   ├── img/hero/           carrousel de l'accueil (4:5) : nom-480/720/960.webp
│   ├── img/atelier/        photos de la section « L'atelier »
│   ├── img/creations/      photos des créations : nom-400/800/1200.webp
│   ├── img/tiktok/         couvertures des vidéos (405×720)
│   ├── img/insta/          miniatures Instagram (400×400)
│   ├── img/tissus/         petites pastilles de tissus (96×96)
│   ├── img/og-image.jpg    image d'aperçu lors d'un partage (1200×630)
│   └── icons/              favicon et icônes
├── favicon.ico             icône de l'onglet (anciens navigateurs, Google)
├── site.webmanifest
├── robots.txt
└── sitemap.xml
```

## Voir le site en local

Ouvrir `index.html` dans le navigateur suffit. Pour un rendu identique à la mise en ligne :

```bash
python -m http.server 5500 --directory creation-ka
```

puis aller sur http://localhost:5500.

## Ajouter une création

1. Préparer 3 tailles de la photo en WebP : `nom-400.webp`, `nom-800.webp`, `nom-1200.webp` (largeur en pixels),
   et les déposer dans `assets/img/creations/`. Le site gratuit [Squoosh](https://squoosh.app) fait ça très bien.
2. Dans `index.html`, copier un bloc `<li class="card">…</li>` de la galerie.
3. Changer :
   - les chemins des photos (`src`, `srcset`, `data-large`) et `width` / `height` (taille de la version 400) ;
   - le texte `alt` (description de la photo) ;
   - l'étiquette, le titre et la description ;
   - `data-piece` et `aria-label` du bouton « Commander » (le nom de la pièce) ;
   - `data-cat` : `sacs`, `accessoires` ou `naissance` (pour les filtres).

Le bouton « Commander » ouvre Instagram et copie un message tout prêt, par exemple :
« Bonjour Karine ! Je suis intéressé(e) par : Sac banane (vu sur votre site). »

## Changer une vidéo TikTok

Dans la section « Coulisses », changer le lien `href` (copier le lien de la vidéo depuis TikTok),
la couverture dans `assets/img/tiktok/` (format 9:16, environ 405×720) et le petit titre.

## Hébergement actuel : GitHub Pages

Le site est en ligne (provisoirement) à l'adresse **https://ivar-lordbrock.github.io/creation-k/**,
depuis le dépôt GitHub `Ivar-lordbrock/creation-k` (branche `main`, dossier racine).

**Mettre à jour le site** : modifier les fichiers, puis dans ce dossier :

```bash
git add -A
git commit -m "Mise à jour du site"
git push
```

GitHub republie le site tout seul en une à deux minutes.

À faire une fois : déclarer le site dans [Google Search Console](https://search.google.com/search-console)
(propriété « Préfixe d'URL » avec l'adresse ci-dessus) et y envoyer `sitemap.xml`.
L'aperçu de partage se teste avec le [débogueur Facebook](https://developers.facebook.com/tools/debug/).

## Passer à un nom de domaine

1. Remplacer `https://ivar-lordbrock.github.io/creation-k/` par la nouvelle adresse dans `index.html`
   (canonical, og:url, og:image et données structurées) et dans `sitemap.xml`.
2. `404.html` : remplacer `/creation-k/` par `/` partout.
3. `robots.txt` : activer la ligne `Sitemap`.
4. Relier le domaine dans GitHub (Settings → Pages → Custom domain) ou chez un autre hébergeur.

## Avant la mise en ligne

- [ ] Compléter les zones `[À COMPLÉTER]` de `mentions-legales.html` (nom, statut, SIRET, adresse, e-mail, hébergeur).
- [ ] Ajouter la ville ou la région de l'atelier dans le texte et la description, pour le référencement local.
- [ ] Faire relire le texte « À propos » à Karine (il reprend son post « Mon histoire »).

## Contrôles déjà faits (novembre 2026)

- HTML : aucun identifiant en double, toutes les ancres, icônes et images existent, un seul titre H1, niveaux de titres dans l'ordre.
- Images : toutes ont un texte `alt` et des dimensions (pas de décalage à l'affichage).
- Contrastes : tous les textes respectent la norme WCAG AA (4,5:1).
- Vitesse : aucun appel à un service extérieur, seule la 1re photo du carrousel est chargée d'emblée.
- Testé sur téléphone (375 px) et ordinateur (1280 px).

## Autres hébergeurs gratuits possibles

- **Netlify** : glisser-déposer le dossier `creation-ka` sur https://app.netlify.com/drop.
- **Cloudflare Pages** : créer un projet, envoyer le dossier (« Direct upload »), aucun réglage de build.

Dans ce cas, mettre à jour les adresses comme indiqué dans « Passer à un nom de domaine ».
