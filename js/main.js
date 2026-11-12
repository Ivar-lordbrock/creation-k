/* ==========================================================================
   Création K — scripts du site
   JavaScript « vanilla », sans dépendance. Le site reste lisible sans JS :
   ce fichier ajoute seulement du confort (menu, carrousel, filtres…).
   ========================================================================== */
(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const moinsDeMouvement = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ordinateur = window.matchMedia('(min-width: 900px)');

  /* 1. Année du pied de page --------------------------------------------- */
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* 2. En-tête : petite ombre dès qu'on fait défiler ---------------------- */
  const header = $('.site-header');
  const surDefilement = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  surDefilement();
  window.addEventListener('scroll', surDefilement, { passive: true });

  /* 3. Menu mobile -------------------------------------------------------- */
  const boutonMenu = $('.menu-toggle');
  const menu = $('#menu');

  const ouvrirMenu = (ouvert) => {
    boutonMenu.setAttribute('aria-expanded', String(ouvert));
    boutonMenu.setAttribute('aria-label', ouvert ? 'Fermer le menu' : 'Ouvrir le menu');
    menu.classList.toggle('is-open', ouvert);
    document.body.classList.toggle('menu-open', ouvert);
  };

  boutonMenu.addEventListener('click', () => {
    ouvrirMenu(boutonMenu.getAttribute('aria-expanded') !== 'true');
  });
  // Un clic sur un lien du menu le referme
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) ouvrirMenu(false);
  });
  // Touche Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      ouvrirMenu(false);
      boutonMenu.focus();
    }
  });
  // Passage en affichage ordinateur : on referme
  ordinateur.addEventListener('change', (e) => { if (e.matches) ouvrirMenu(false); });

  /* 4. Carrousel du hero (fondu toutes les 5 s) ---------------------------
     Les photos 2 à 4 n'ont pas de vraie source au départ (data-src) :
     on les charge seulement une fois la page affichée, pour que
     la 1re photo et le texte arrivent le plus vite possible. */
  const slides = $$('.hero .slide');
  const chargerPhoto = (img) => {
    if (img.dataset.srcset) { img.srcset = img.dataset.srcset; delete img.dataset.srcset; }
    if (img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; }
  };

  if (slides.length > 1) {
    const FONDU = 1200; // durée du fondu en ms, la même que dans le CSS (.slide)
    let actuelle = 0;
    let minuteur = null;

    const suivante = async () => {
      const sortante = slides[actuelle];
      actuelle = (actuelle + 1) % slides.length;
      const entrante = slides[actuelle];
      chargerPhoto(entrante);
      // On attend que la photo soit prête à l'affichage : sinon son décodage
      // tombe en plein fondu et l'animation saute.
      try { await entrante.decode(); } catch (e) { /* on l'affiche quand même */ }
      entrante.classList.remove('is-leaving');
      sortante.classList.replace('is-active', 'is-leaving'); // reste visible dessous
      entrante.classList.add('is-active');                   // arrive en fondu dessus
      // Petite marge : l'ancienne photo ne se réinitialise qu'une fois bien cachée
      window.setTimeout(() => sortante.classList.remove('is-leaving'), FONDU + 150);
    };

    // Inutile de charger les autres photos si le carrousel ne tourne pas
    const prechargerPhotos = () => { if (!moinsDeMouvement.matches) slides.forEach(chargerPhoto); };
    if (document.readyState === 'complete') prechargerPhotos();
    else window.addEventListener('load', prechargerPhotos, { once: true });
    const demarrer = () => {
      if (!minuteur && !moinsDeMouvement.matches && !document.hidden) {
        minuteur = window.setInterval(suivante, 5000);
      }
    };
    const arreter = () => {
      window.clearInterval(minuteur);
      minuteur = null;
    };

    // Pause quand l'onglet est caché ou si l'utilisateur préfère moins d'animations
    document.addEventListener('visibilitychange', () => (document.hidden ? arreter() : demarrer()));
    moinsDeMouvement.addEventListener('change', () => (moinsDeMouvement.matches ? arreter() : demarrer()));
    demarrer();
  }

  /* 5. Apparition douce des blocs au défilement --------------------------- */
  const blocs = $$('.reveal');
  if ('IntersectionObserver' in window && !moinsDeMouvement.matches) {
    const observateur = new IntersectionObserver((entrees) => {
      let rang = 0;
      entrees.forEach((entree) => {
        if (!entree.isIntersecting) return;
        // Léger décalage entre les blocs qui apparaissent en même temps
        entree.target.style.setProperty('--delai', `${Math.min(rang, 4) * 80}ms`);
        entree.target.classList.add('is-visible');
        observateur.unobserve(entree.target);
        rang += 1;
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
    blocs.forEach((bloc) => observateur.observe(bloc));
  } else {
    blocs.forEach((bloc) => bloc.classList.add('is-visible'));
  }

  /* 6. Filtres de la galerie --------------------------------------------- */
  const puces = $$('.chip[data-filter]');
  const cartes = $$('.gallery .card');
  puces.forEach((puce) => {
    puce.addEventListener('click', () => {
      const filtre = puce.dataset.filter;
      puces.forEach((p) => {
        const active = p === puce;
        p.classList.toggle('is-active', active);
        p.setAttribute('aria-pressed', String(active));
      });
      cartes.forEach((carte) => {
        const visible = filtre === 'tout' || carte.dataset.cat === filtre;
        carte.hidden = !visible;
        if (visible) carte.classList.add('is-visible');
      });
    });
  });

  /* 7. « Commander cette pièce » : copie un message tout prêt -------------
     Instagram ne permet pas de pré-remplir un message privé.
     On copie donc le texte : il suffit de le coller dans la conversation.
     Le lien s'ouvre normalement, on ne bloque rien. */
  const toast = $('.toast');
  let minuteurToast = null;
  const afficherToast = (texte) => {
    toast.textContent = texte;
    toast.classList.add('is-visible');
    window.clearTimeout(minuteurToast);
    minuteurToast = window.setTimeout(() => toast.classList.remove('is-visible'), 5000);
  };

  document.addEventListener('click', (e) => {
    const lien = e.target.closest('a[data-piece]');
    if (!lien || !lien.dataset.piece || !navigator.clipboard) return;
    const message = `Bonjour Karine ! Je suis intéressé(e) par : ${lien.dataset.piece} (vu sur votre site).`;
    navigator.clipboard.writeText(message)
      .then(() => afficherToast('Message copié ! Collez-le dans la conversation Instagram.'))
      .catch(() => { /* copie refusée : le lien s'ouvre quand même */ });
  });

  /* 8. Agrandissement d'une création ------------------------------------- */
  const fenetre = $('.lightbox');
  if (fenetre) {
    const image = $('.lightbox-img', fenetre);
    const tag = $('.lightbox-tag', fenetre);
    const titre = $('.lightbox-title', fenetre);
    const desc = $('.lightbox-desc', fenetre);
    const commander = $('.lightbox-order', fenetre);
    let declencheur = null;

    document.addEventListener('click', (e) => {
      const zoom = e.target.closest('.card-zoom');
      if (!zoom) return;
      const carte = zoom.closest('.card');
      const vignette = $('img', zoom);
      const grande = vignette.dataset.large || vignette.currentSrc || vignette.src;

      // Navigateur trop ancien : on ouvre simplement la grande photo
      if (typeof fenetre.showModal !== 'function') {
        window.open(grande, '_blank', 'noopener');
        return;
      }

      // On affiche d'abord la vignette (instantané), puis la grande photo dès qu'elle est prête
      image.src = vignette.currentSrc || vignette.src;
      image.alt = vignette.alt;
      const precharge = new Image();
      precharge.onload = () => { if (fenetre.open && image.alt === vignette.alt) image.src = grande; };
      precharge.src = grande;

      const piece = $('a[data-piece]', carte)?.dataset.piece || $('h3', carte)?.textContent || '';
      tag.textContent = $('.card-tag', carte)?.textContent || '';
      titre.textContent = $('h3', carte)?.textContent || '';
      desc.textContent = $('.card-desc', carte)?.textContent || '';
      commander.dataset.piece = piece;
      commander.setAttribute('aria-label', `Commander cette pièce sur Instagram : ${piece}`);

      declencheur = zoom;
      fenetre.showModal();
    });

    $('.lightbox-close', fenetre).addEventListener('click', () => fenetre.close());
    // Clic à côté de la fenêtre = fermer
    fenetre.addEventListener('click', (e) => { if (e.target === fenetre) fenetre.close(); });
    // Après « Commander », on referme pour que le message « copié » reste visible
    commander.addEventListener('click', () => window.setTimeout(() => fenetre.close(), 200));
    fenetre.addEventListener('close', () => { if (declencheur) declencheur.focus(); });
  }

  /* 9. Vidéos TikTok : simples liens dans le HTML, aucun script nécessaire.
     (Les lecteurs intégrés de TikTok affichaient « Server error »
     et des vidéos d'autres comptes : on a préféré un lien direct.) */

  /* 10. Bouton « Commander » flottant (mobile) ----------------------------
     Visible quand les boutons du hero ne sont plus à l'écran,
     masqué quand on arrive au contact ou au pied de page. */
  const flottant = $('.floating-cta');
  const boutonsHero = $('.hero-actions');
  const finDePage = [$('#contact'), $('.site-footer')].filter(Boolean);

  if (flottant && boutonsHero && 'IntersectionObserver' in window) {
    const etat = new Map();
    const majFlottant = () => {
      const heroVisible = etat.get(boutonsHero) !== false;
      const finVisible = finDePage.some((el) => etat.get(el));
      flottant.classList.toggle('is-visible', !heroVisible && !finVisible);
    };
    const observateurFlottant = new IntersectionObserver((entrees) => {
      entrees.forEach((entree) => etat.set(entree.target, entree.isIntersecting));
      majFlottant();
    });
    [boutonsHero, ...finDePage].forEach((el) => observateurFlottant.observe(el));
  }
})();
