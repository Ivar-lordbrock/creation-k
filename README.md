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
├── mentions-legales.html   mentions légales (éditrice, hébergeur, commandes)
├── 404.html                page « introuvable » (utilisée automatiquement par l'hébergeur)
├── CNAME                   nom de domaine pour GitHub Pages (creationdek.fr)
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

## Hébergement : GitHub Pages + creationdek.fr

Le site est en ligne à l'adresse **https://creationdek.fr/**, publié gratuitement par GitHub Pages
depuis le dépôt `Ivar-lordbrock/creation-k` (branche `main`, dossier racine).
L'ancienne adresse `ivar-lordbrock.github.io/creation-k/` renvoie automatiquement vers le domaine.

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

## Nom de domaine creationdek.fr

- Acheté chez **OVH** le 25/11/2026, à renouveler chaque année (vers le 25 novembre).
- Réglages DNS dans l'espace client OVH (Noms de domaine → creationdek.fr → Zone DNS) :

  | Type  | Sous-domaine | Cible |
  |-------|--------------|-------|
  | A     | (vide)       | 185.199.108.153 |
  | A     | (vide)       | 185.199.109.153 |
  | A     | (vide)       | 185.199.110.153 |
  | A     | (vide)       | 185.199.111.153 |
  | CNAME | www          | ivar-lordbrock.github.io. |

- Côté GitHub : Settings → Pages → Custom domain = `creationdek.fr`, case « Enforce HTTPS » cochée.
  Le fichier `CNAME` à la racine garde ce réglage : ne pas le supprimer.
- Changer d'adresse un jour : la remplacer dans `index.html` (canonical, og:url, og:image,
  données structurées), `sitemap.xml`, `robots.txt` et `CNAME`.

## Reste à faire

- [ ] Si Création K obtient un numéro SIRET, l'ajouter dans `mentions-legales.html`.

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
