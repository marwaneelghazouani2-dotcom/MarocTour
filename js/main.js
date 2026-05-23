document.addEventListener("DOMContentLoaded", () => {
    // 0. CONFIGURATION DE LA LANGUE ET INITIALISATION DE LA PAGE (LANGUAGE SETUP)
    // Détermine la page active et récupère la langue préférée enregistrée dans le stockage local (localStorage).
    // Si aucune langue n'est enregistrée, utilise le français ('fr') par défaut.
    // Applique les attributs de langue (lang) et la direction d'écriture (dir) sur la racine HTML.
    // Gère le support spécifique à l'arabe ('ar') en chargeant dynamiquement la version RTL de Bootstrap.
    const path = window.location.pathname;
    let pageName = 'index';
    if (path.includes('.html')) {
        const match = path.match(/\/([^\/]+)\.html$/);
        if (match && match[1] !== 'index') {
            pageName = match[1];
        }
    }
    
    // Retrieve selected language or default to 'fr'
    let currentLang = localStorage.getItem('lang') || 'fr';
    
    // Set HTML lang attribute and dir
    document.documentElement.lang = currentLang;
    if (currentLang === 'ar') {
        document.documentElement.dir = 'rtl';
        // Switch Bootstrap to RTL version
        const bootstrapLink = document.querySelector('link[href*="bootstrap.min.css"]') || document.querySelector('link[href*="bootstrap"]');
        if (bootstrapLink) {
            bootstrapLink.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.rtl.min.css";
        }
    } else {
        document.documentElement.dir = 'ltr';
        // Switch Bootstrap to standard LTR version
        const bootstrapLink = document.querySelector('link[href*="bootstrap.rtl.min.css"]') || document.querySelector('link[href*="bootstrap"]');
        if (bootstrapLink) {
            bootstrapLink.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
        }
    }

    // 1. INJECTION ET GESTION DU PRÉCHARGEUR CINÉMATIQUE (DYNAMIC PRELOADER INJECTION)
    // Crée dynamiquement un écran de chargement (preloader) au tout début du corps de la page.
    // L'animation présente un motif géométrique ou une étoile dorée qui tourne.
    // Un gestionnaire d'événement écoute la fin du chargement de la fenêtre ('load') pour masquer 
    // l'écran de chargement avec un fondu fluide après un délai esthétique de 800ms.
    const preloaderDiv = document.createElement('div');
    preloaderDiv.id = 'preloader';
    preloaderDiv.setAttribute('aria-hidden', 'true');
    preloaderDiv.innerHTML = '<div class="star-loader"></div>';
    document.body.insertBefore(preloaderDiv, document.body.firstChild);

    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 800);
    });

    // 2. GENERATION ET INJECTION DYNAMIQUE DE LA BARRE DE NAVIGATION (DYNAMIC NAVBAR INJECTION)
    // Injecte une barre de navigation responsive unifiée dans le conteneur '#navbar-placeholder'.
    // Elle s'adapte automatiquement selon que l'on se trouve sur la page d'accueil (index) ou une page de ville.
    // Génère dynamiquement le menu déroulant des 12 villes en traduisant leurs noms à la volée.
    // Construit le commutateur de langue avec un menu déroulant premium (globe terrestre) affichant FR, EN, ES, AR.
    // Attache des écouteurs de clics pour sauvegarder la langue choisie et recharger la page proprement.
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (navbarPlaceholder) {
        const commonDict = window.MarocTranslations.common ? window.MarocTranslations.common[currentLang] : {};
        
        const isIndex = path.endsWith('index.html') || path.endsWith('/') || !path.includes('.html');
        const brandHref = isIndex ? '#hero' : 'index.html';
        
        const navVilles = commonDict['nav_villes'] || 'Villes';
        const navAccueil = commonDict['nav_accueil'] || 'Accueil';
        const navChapitres = commonDict['nav_chapitres'] || 'Chapitres';
        const navDestinations = commonDict['nav_destinations'] || 'Destinations';
        const navContact = commonDict['nav_contact'] || 'Contact';
        const navLieux = commonDict['nav_lieux'] || 'Lieux';
        const navHotels = commonDict['nav_hotels'] || 'Hôtels';
        const navRestaurants = commonDict['nav_restaurants'] || 'Restaurants';

        const navItems = isIndex ? `
            <li class="nav-item"><a class="nav-link" href="#chapter-1">${navChapitres}</a></li>
            <li class="nav-item"><a class="nav-link" href="#destinations">${navDestinations}</a></li>
        ` : `
            <li class="nav-item"><a class="nav-link" href="index.html">${navAccueil}</a></li>
        `;
        const extraNavItems = isIndex ? `
            <li class="nav-item"><a class="nav-link" href="#contact">${navContact}</a></li>
        ` : `
            <li class="nav-item"><a class="nav-link" href="#lieux">${navLieux}</a></li>
            <li class="nav-item"><a class="nav-link" href="#hotels">${navHotels}</a></li>
            <li class="nav-item"><a class="nav-link" href="#restaurants">${navRestaurants}</a></li>
        `;

        // Render cities list dynamically to ensure translations
        let dropdownCities = '';
        const cityKeys = ["tanger", "tetouan", "chefchaouen", "rabat", "sale", "casablanca", "marrakech", "ouarzazate", "agadir", "guelmim", "laayoune", "dakhla"];
        cityKeys.forEach(cityKey => {
            const labelKey = `city_${cityKey}`;
            const displayName = commonDict[labelKey] || (cityKey.charAt(0).toUpperCase() + cityKey.slice(1));
            dropdownCities += `<li><a class="dropdown-item" href="${cityKey}.html">${displayName}</a></li>`;
        });
        
        // Language labels
        const langLabels = {
            fr: "FR",
            en: "EN",
            es: "ES",
            ar: "AR"
        };
        const currentLangLabel = langLabels[currentLang] || "FR";

        navbarPlaceholder.innerHTML = `
        <nav id="navbar" class="navbar navbar-expand-lg fixed-top navbar-custom">
            <div class="container">
                <a class="navbar-brand" href="${brandHref}"><i class="fas fa-star" style="font-size: 1.2rem; margin-right: 8px;"></i> MAROC</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        ${navItems}
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="villesDropdown" role="button" data-bs-toggle="dropdown">
                                ${navVilles}
                            </a>
                            <ul class="dropdown-menu">
                                ${dropdownCities}
                            </ul>
                        </li>
                        ${extraNavItems}
                        <!-- Premium Language Switcher -->
                        <li class="nav-item dropdown ms-lg-3">
                            <a class="nav-link dropdown-toggle lang-switcher" href="#" id="langDropdown" role="button" data-bs-toggle="dropdown">
                                <i class="fas fa-globe me-1"></i> <span>${currentLangLabel}</span>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><a class="dropdown-item lang-option" href="#" data-lang="fr">Français (FR)</a></li>
                                <li><a class="dropdown-item lang-option" href="#" data-lang="en">English (EN)</a></li>
                                <li><a class="dropdown-item lang-option" href="#" data-lang="es">Español (ES)</a></li>
                                <li><a class="dropdown-item lang-option" href="#" data-lang="ar">العربية (AR)</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        `;

        // Bind language switcher clicks
        navbarPlaceholder.querySelectorAll('.lang-option').forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedLang = opt.getAttribute('data-lang');
                if (selectedLang !== currentLang) {
                    localStorage.setItem('lang', selectedLang);
                    window.location.reload();
                }
            });
        });
    }

    // 3. GESTION DU TRACEUR DE DÉFILEMENT FLOTTANT (DYNAMIC SCROLL TRACKER INJECTION)
    // Génère une barre de navigation latérale composée de puces interactives (Dots) pour chaque section de la page.
    // Un clic sur une puce fait défiler l'écran de manière fluide vers la section correspondante.
    // Utilise IntersectionObserver pour détecter la section actuellement visible à l'écran et 
    // ajouter la classe active sur la puce correspondante en temps réel.
    const scrollTitles = {
        fr: {
            'hero': 'Intro',
            'chapter-1': 'Chapitre I',
            'chapter-2': 'Chapitre II',
            'chapter-3': 'Chapitre III',
            'histoire': 'Présentation',
            'lieux': 'Lieux',
            'hotels': 'Hôtels',
            'restaurants': 'Restaurants',
            'destinations': 'Destinations',
            'contact': 'Contact'
        },
        en: {
            'hero': 'Intro',
            'chapter-1': 'Chapter I',
            'chapter-2': 'Chapter II',
            'chapter-3': 'Chapter III',
            'histoire': 'About',
            'lieux': 'Sights',
            'hotels': 'Hotels',
            'restaurants': 'Restaurants',
            'destinations': 'Destinations',
            'contact': 'Contact'
        },
        es: {
            'hero': 'Intro',
            'chapter-1': 'Capítulo I',
            'chapter-2': 'Capítulo II',
            'chapter-3': 'Capítulo III',
            'histoire': 'Presentación',
            'lieux': 'Lugares',
            'hotels': 'Hoteles',
            'restaurants': 'Restaurantes',
            'destinations': 'Destinos',
            'contact': 'Contacto'
        },
        ar: {
            'hero': 'البداية',
            'chapter-1': 'الفصل الأول',
            'chapter-2': 'الفصل الثاني',
            'chapter-3': 'الفصل الثالث',
            'histoire': 'لمحة عامة',
            'lieux': 'المعالم',
            'hotels': 'الفنادق',
            'restaurants': 'المطاعم',
            'destinations': 'الوجهات',
            'contact': 'اتصل بنا'
        }
    };

    const titleMap = scrollTitles[currentLang] || scrollTitles.fr;

    const sections = document.querySelectorAll('section');
    if (sections.length > 0) {
        const trackerContainer = document.createElement('div');
        trackerContainer.className = 'scroll-tracker';
        trackerContainer.setAttribute('aria-hidden', 'true');

        sections.forEach((sec, idx) => {
            const id = sec.id;
            if (!id) return;
            const title = titleMap[id] || id;
            const dot = document.createElement('div');
            dot.className = 'tracker-dot' + (idx === 0 ? ' active' : '');
            dot.setAttribute('data-target', '#' + id);
            dot.setAttribute('title', title);
            dot.addEventListener('click', () => {
                sec.scrollIntoView({ behavior: 'smooth' });
            });
            trackerContainer.appendChild(dot);
        });
        document.body.appendChild(trackerContainer);

        // 3.1. SCROLL TRACKER OBSERVER (sync active state)
        const trackerDots = trackerContainer.querySelectorAll('.tracker-dot');
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && trackerDots.length > 0) {
                    trackerDots.forEach(dot => dot.classList.remove('active'));
                    const activeDot = trackerContainer.querySelector(`.tracker-dot[data-target="#${entry.target.id}"]`);
                    if (activeDot) activeDot.classList.add('active');
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(sec => sectionObserver.observe(sec));
    }

    // 4. GENERATION ET INJECTION DYNAMIQUE DU PIED DE PAGE (DYNAMIC FOOTER INJECTION)
    // Injecte le pied de page (footer) traduit selon la langue courante dans le conteneur '#footer-placeholder'.
    // Affiche le nom de la ville ou du pays, un sous-titre adapté, les icônes de réseaux sociaux interactives,
    // ainsi que la mention des droits d'auteur dans la langue active.
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        const pageDict = window.MarocTranslations[pageName] ? window.MarocTranslations[pageName][currentLang] : {};
        const commonDict = window.MarocTranslations.common ? window.MarocTranslations.common[currentLang] : {};
        
        const cityTrans = pageDict['footer_city'] || commonDict['footer_title'] || 'MAROC MAGIQUE';
        const taglineTrans = pageDict['footer_tagline'] || commonDict['footer_tagline'] || 'Découvrez la beauté, la culture et la majesté du Royaume.';
        const rightsTrans = commonDict['footer_rights'] || 'Tous droits réservés.';
        
        const cityKey = footerPlaceholder.getAttribute('data-city') || 'MAROC MAGIQUE';
        let footerHTML = '';
        
        if (cityKey === 'MAROC MAGIQUE') {
            footerHTML = `
            <footer class="text-center">
                <div class="container">
                    <h4 class="mb-3">${cityTrans}</h4>
                    <p class="text-muted" style="font-weight: 300;">${taglineTrans}</p>
                    <div class="social-icons mt-4 mb-4">
                        <a href="#"><i class="fab fa-facebook-f fa-lg"></i></a>
                        <a href="#"><i class="fab fa-instagram fa-lg"></i></a>
                        <a href="#"><i class="fab fa-twitter fa-lg"></i></a>
                        <a href="#"><i class="fab fa-youtube fa-lg"></i></a>
                    </div>
                    <p class="small text-muted" style="font-size: 0.8rem; letter-spacing: 1px;">&copy; 2026 Maroc Magique Tourisme. ${rightsTrans}</p>
                </div>
            </footer>
            `;
        } else {
            footerHTML = `
            <footer class="text-center">
                <div class="container">
                    <h4 class="mb-3">${cityTrans}, ${taglineTrans}</h4>
                    <p class="text-muted" style="font-weight: 300;">&copy; 2026 Tourisme ${cityTrans}. ${rightsTrans}</p>
                    <div class="social-icons mt-4 mb-4">
                        <a href="#"><i class="fab fa-facebook-f fa-lg"></i></a>
                        <a href="#"><i class="fab fa-instagram fa-lg"></i></a>
                        <a href="#"><i class="fab fa-twitter fa-lg"></i></a>
                        <a href="#"><i class="fab fa-youtube fa-lg"></i></a>
                    </div>
                    <p class="small text-muted" style="font-size: 0.8rem; letter-spacing: 1px;">&copy; 2026 Maroc Magique Tourisme. ${rightsTrans}</p>
                </div>
            </footer>
            `;
        }
        footerPlaceholder.innerHTML = footerHTML;
    }

    // 5. MOTEUR DE TRADUCTION DYNAMIQUE DU DOM (DOM TRANSLATION ENGINE)
    // Parcourt tout le document HTML à la recherche d'attributs de traduction :
    // - [data-i18n] : Remplace le texte brut de l'élément en préservant ses icônes FontAwesome enfants.
    // - [data-i18n-html] : Injecte du code HTML traduit (utile pour les retours à la ligne '<br>').
    // - [data-i18n-placeholder] : Localise les attributs de saisie (placeholders) dans les formulaires.
    // Injecte également le titre de la page et la description meta pour l'optimisation SEO de chaque langue.
    function translateDOM() {
        const pageDict = window.MarocTranslations[pageName] ? window.MarocTranslations[pageName][currentLang] : {};
        const commonDict = window.MarocTranslations.common ? window.MarocTranslations.common[currentLang] : {};
        
        // Translate page title
        const transTitle = pageDict['title'] || pageDict['page_title'] || commonDict['title'];
        if (transTitle) {
            document.title = transTitle;
        }
        
        // Translate page meta description
        const transDesc = pageDict['page_desc'] || pageDict['hero_subtitle'];
        if (transDesc) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute('content', transDesc);
            }
        }

        // Translate text elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            let translation = pageDict[key] || commonDict[key];
            if (translation !== undefined) {
                // Special placeholder replace for subtitle_lieux & subtitle_restaurants
                if (key === 'subtitle_lieux') {
                    const cityVal = pageDict['footer_city'] || '';
                    translation = translation.replace('{city}', cityVal);
                } else if (key === 'subtitle_restaurants') {
                    const cityVal = pageDict['footer_city'] || '';
                    translation = translation.replace('{city}', cityVal);
                }
                
                // Keep icon if element contains one
                const icon = el.querySelector('i');
                if (icon) {
                    el.innerHTML = '';
                    el.appendChild(icon);
                    el.appendChild(document.createTextNode(' ' + translation));
                } else {
                    el.textContent = translation;
                }
            }
        });

        // Translate HTML elements
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            const translation = pageDict[key] || commonDict[key];
            if (translation !== undefined) {
                el.innerHTML = translation;
            }
        });

        // Translate inputs and placeholder attributes
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = pageDict[key] || commonDict[key];
            if (translation !== undefined) {
                el.setAttribute('placeholder', translation);
            }
        });
    }

    // Run translations
    translateDOM();

    // 6. EFFETS VISUELS DE LA BARRE DE NAVIGATION AU DEFILEMENT (NAVBAR SCROLL EFFECT)
    // Écoute le défilement de la page. Si l'utilisateur fait défiler de plus de 50 pixels,
    // ajoute la classe '.scrolled' à la barre de navigation pour la rendre translucide avec un flou de verre.
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 7. PARALLAXE DE L'ARRIERE-PLAN ET TYPOGRAPHIE CINETIQUE (KINETIC TYPOGRAPHY & PARALLAX)
    // Utilise un gestionnaire d'événement de défilement optimisé via 'requestAnimationFrame' pour réduire la charge CPU.
    // Calcule la position verticale de défilement pour :
    // - Faire glisser l'image de fond du Hero en parallaxe à vitesse réduite (0.4x).
    // - Réduire l'opacité et modifier l'espacement des lettres du titre Hero au fur et à mesure du défilement vers le bas.
    // - Mettre à jour la progression de la carte interactive du Maroc.
    const heroTitle = document.getElementById('heroTitle');
    const heroSubtitle = document.getElementById('heroSubtitle');
    const heroBg = document.getElementById('heroBg');

    let ticking = false;
    let lastScrollY = window.scrollY;

    function updateOnScroll() {
        if (lastScrollY < window.innerHeight && heroBg) {
            heroBg.style.transform = `translate3d(0, ${lastScrollY * 0.4}px, 0)`;
            const scale = Math.max(0.6, 1 - lastScrollY * 0.0008);
            const letterSpacing = 0.15 + (lastScrollY * 0.0015);
            const opacity = Math.max(0, 1 - lastScrollY * 0.002);
            
            if (heroTitle) {
                heroTitle.style.transform = `translate3d(0, ${lastScrollY * 0.5}px, 0) scale(${scale})`;
                heroTitle.style.letterSpacing = `${letterSpacing}em`;
                heroTitle.style.opacity = opacity;
            }
            if (heroSubtitle) {
                heroSubtitle.style.transform = `translate3d(0, ${lastScrollY * 0.2}px, 0)`;
                heroSubtitle.style.opacity = opacity;
            }
        }
        
        if (typeof updateMapScroll === 'function' && updateMapScroll !== null) {
            updateMapScroll();
        }
        
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });

    // 8. ANIMATIONS D'APPARITION PROGRESSIVE AU DEFILEMENT (INTERSECTION OBSERVER FOR REVEALS)
    // Observe les éléments ayant les classes '.img-reveal', '.text-reveal', et '.fade-up'.
    // Dès qu'ils entrent de plus de 15% dans l'écran, leur applique la classe '.in-view' pour déclencher
    // les transitions de fondu et de glissement matériel définies en CSS.
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.img-reveal, .text-reveal, .fade-up').forEach(el => {
        revealObserver.observe(el);
    });

    // 8.1. LOGIQUE DE LA CARTE INTERACTIVE DU MAROC (INTERACTIVE MOROCCO MAP LOGIC)
    const mapSection = document.getElementById('interactive-map');
    let updateMapScroll = null; // Déclaration globale de la fonction de mise à jour au défilement
    
    if (mapSection) {
        // Sélection de tous les éléments DOM nécessaires pour la carte
        const cityNodes = mapSection.querySelectorAll('.city-node'); // Cercles marqueurs des villes
        const regionPaths = mapSection.querySelectorAll('.region-path'); // Tracés SVG des régions administratives
        const mapTooltip = document.getElementById('map-tooltip'); // Fiche d'information flottante (tooltip)
        const connectionLine = mapSection.querySelector('.map-connection-line'); // Ligne de liaison pointillée
        const stickyMapContainer = mapSection.querySelector('.sticky-map-container'); // Conteneur parent figé (sticky)
        let tooltipTimeout; // Temporisateur pour le masquage fluide de la fiche tooltip
        let isHoveringTooltip = false; // Drapeau indiquant si le pointeur survole la fiche tooltip
        let isHoveringMapNode = false; // Drapeau indiquant si le pointeur survole un marqueur de ville

        // Convertisseur de coordonnées SVG -> CSS :
        // Les navigateurs modernes exigent des unités comme 'px' pour les transformations CSS.
        // Si nous appliquons directement 'scale()' sans spécifier 'translate(Xpx, Ypx)', les marqueurs s'effondrent à (0, 0).
        // Cette fonction convertit 'translate(X, Y)' de l'attribut SVG en 'translate(Xpx, Ypx)' conforme au standard CSS.
        // Calcule et convertit le translate SVG brut en format CSS standard avec unités 'px'
        function getTranslateCSS(node) {
            const translateAttr = node.getAttribute('transform') || '';
            return translateAttr.replace(
                /translate\(\s*([0-9.-]+)\s*,\s*([0-9.-]+)\s*\)/i, 
                'translate($1px, $2px)'
            );
        }

        // Map city to its region identifier
        const cityToRegionMap = {
            tanger: 'tanger-tetouan',
            tetouan: 'tanger-tetouan',
            chefchaouen: 'tanger-tetouan',
            rabat: 'rabat-sale',
            sale: 'rabat-sale',
            casablanca: 'casablanca',
            marrakech: 'marrakech',
            ouarzazate: 'daraa',
            agadir: 'souss-massa',
            guelmim: 'guelmim',
            laayoune: 'laayoune',
            dakhla: 'dakhla'
        };

        const cityKeys = ["tanger", "tetouan", "chefchaouen", "sale", "rabat", "casablanca", "marrakech", "ouarzazate", "agadir", "guelmim", "laayoune", "dakhla"];

        // Setup connection line SVG properties
        if (connectionLine) {
            const length = connectionLine.getTotalLength();
            connectionLine.style.strokeDasharray = length;
            connectionLine.style.strokeDashoffset = length;
        }

        // Affiche et positionne la fiche d'information flottante (tooltip) au-dessus de la ville active
        function showTooltipCard(cityKey, targetElement) {
            clearTimeout(tooltipTimeout);
            
            const pageDict = window.MarocTranslations['index'] ? window.MarocTranslations['index'][currentLang] : {};
            const commonDict = window.MarocTranslations.common ? window.MarocTranslations.common[currentLang] : {};
            
            const cityName = commonDict[`city_${cityKey}`] || (cityKey.charAt(0).toUpperCase() + cityKey.slice(1));
            const cityDesc = pageDict[`desc_${cityKey}`] || '';
            const exploreText = pageDict['map_explore'] || 'Découvrir';
            
            document.getElementById('tooltip-title').textContent = cityName;
            document.getElementById('tooltip-desc').textContent = cityDesc;
            
            const tooltipLink = document.getElementById('tooltip-link');
            tooltipLink.setAttribute('href', `${cityKey}.html`);
            tooltipLink.querySelector('span').textContent = exploreText;
            
            mapTooltip.style.visibility = 'visible';
            mapTooltip.style.pointerEvents = 'auto';
            
            // Calculate tooltip position relative to the sticky map container
            const rect = targetElement.getBoundingClientRect();
            const containerRect = stickyMapContainer.getBoundingClientRect();
            const tooltipWidth = mapTooltip.offsetWidth;
            const tooltipHeight = mapTooltip.offsetHeight;
            
            // Position tooltip above the city node relative to container
            const leftPos = rect.left - containerRect.left + (rect.width / 2) - (tooltipWidth / 2);
            const topPos = rect.top - containerRect.top - tooltipHeight - 12;
            
            mapTooltip.style.left = `${leftPos}px`;
            mapTooltip.style.top = `${topPos}px`;
            
            // Animate transition
            setTimeout(() => {
                mapTooltip.style.opacity = '1';
                mapTooltip.style.transform = 'translateY(0)';
            }, 10);
        }

        // Masque la fiche d'information flottante avec un effet de fondu et de glissement vers le bas
        function hideTooltipCard() {
            tooltipTimeout = setTimeout(() => {
                if (!isHoveringTooltip && !isHoveringMapNode) {
                    mapTooltip.style.opacity = '0';
                    mapTooltip.style.transform = 'translateY(10px)';
                    mapTooltip.style.pointerEvents = 'none';
                    setTimeout(() => {
                        if (mapTooltip.style.opacity === '0') {
                            mapTooltip.style.visibility = 'hidden';
                        }
                    }, 300);
                }
            }, 150);
        }

        // Met en surbrillance un marqueur de ville et sa région administrative associée
        function highlightCity(cityKey) {
            // Activate node
            cityNodes.forEach(node => {
                const translate = getTranslateCSS(node);
                if (node.getAttribute('data-city') === cityKey) {
                    node.classList.add('active');
                    node.style.opacity = '1';
                    node.style.transform = `${translate} scale(1.2)`;
                } else {
                    node.classList.remove('active');
                }
            });

            // Highlight region path
            const regionId = cityToRegionMap[cityKey];
            regionPaths.forEach(path => {
                if (path.getAttribute('data-region') === regionId) {
                    path.classList.add('highlighted');
                } else {
                    path.classList.remove('highlighted');
                }
            });
        }

        function removeHighlights() {
            if (updateMapScroll) {
                updateMapScroll();
            }
        }

        // Event listeners for city markers on SVG map
        cityNodes.forEach(node => {
            const cityKey = node.getAttribute('data-city');
            
            node.addEventListener('mouseenter', () => {
                isHoveringMapNode = true;
                highlightCity(cityKey);
                showTooltipCard(cityKey, node);
            });
            
            node.addEventListener('mouseleave', () => {
                isHoveringMapNode = false;
                hideTooltipCard();
                removeHighlights();
            });
            
            node.addEventListener('click', () => {
                window.location.href = `${cityKey}.html`;
            });
        });

        // Event listeners for hoverable region paths
        regionPaths.forEach(path => {
            path.addEventListener('mouseenter', () => {
                const regionId = path.getAttribute('data-region');
                path.classList.add('highlighted');
                // Highlight corresponding cities
                const associatedCities = Object.keys(cityToRegionMap).filter(key => cityToRegionMap[key] === regionId);
                if (associatedCities.length > 0) {
                    highlightCity(associatedCities[0]);
                }
            });

            path.addEventListener('mouseleave', () => {
                path.classList.remove('highlighted');
                removeHighlights();
            });
        });

        // Tooltip hover persistence
        mapTooltip.addEventListener('mouseenter', () => {
            isHoveringTooltip = true;
            clearTimeout(tooltipTimeout);
        });
        
        mapTooltip.addEventListener('mouseleave', () => {
            isHoveringTooltip = false;
            hideTooltipCard();
            removeHighlights();
        });

        // Fonction de rafraîchissement au défilement (Calcul de progression et affichage séquentiel)
        updateMapScroll = function() {
            const rect = mapSection.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Si la section de la carte n'est pas du tout visible dans le viewport, on quitte pour économiser les ressources
            if (rect.bottom < 0 || rect.top > viewportHeight) {
                return;
            }
            
            // Calcul de la progression du défilement (de 0.0 au début de la section à 1.0 à la fin de la piste)
            const totalScrollable = rect.height - viewportHeight;
            let progress = 0;
            if (totalScrollable > 0) {
                progress = -rect.top / totalScrollable;
            }
            progress = Math.min(1, Math.max(0, progress)); // Borne la progression entre 0 et 1
            
            const numCities = cityKeys.length;
            // Division de la progression globale en segments correspondant au nombre de villes (12)
            const visibleCount = Math.floor(progress * (numCities + 1));
            
            // Dessin progressif de la ligne pointillée de liaison :
            // Nous ajustons le 'strokeDashoffset' de 100% de sa longueur (invisible) à 0% (complètement dessinée)
            if (connectionLine) {
                const length = connectionLine.getTotalLength();
                connectionLine.style.strokeDashoffset = length * (1 - progress);
            }
            
            // Mise à jour de l'affichage des marqueurs si l'utilisateur ne survole pas manuellement un point
            if (!isHoveringMapNode && !isHoveringTooltip) {
                cityKeys.forEach((cityKey, idx) => {
                    const node = mapSection.querySelector(`.city-node[data-city="${cityKey}"]`);
                    const regionId = cityToRegionMap[cityKey];
                    const path = mapSection.querySelector(`.region-path[data-region="${regionId}"]`);
                    
                    if (idx < visibleCount) {
                        // Reveal node
                        if (node) {
                            node.style.opacity = '1';
                            node.style.pointerEvents = 'auto';
                            const translate = getTranslateCSS(node);
                            
                            // The active city is the most recently revealed one
                            if (idx === visibleCount - 1) {
                                node.classList.add('active');
                                node.style.transform = `${translate} scale(1.15)`;
                                showTooltipCard(cityKey, node);
                            } else {
                                node.classList.remove('active');
                                node.style.transform = `${translate} scale(1.0)`;
                            }
                        }
                        if (path) {
                            if (idx === visibleCount - 1) {
                                path.classList.add('highlighted');
                            } else {
                                path.classList.remove('highlighted');
                            }
                        }
                    } else {
                        // Hide node
                        if (node) {
                            node.style.opacity = '0';
                            node.style.pointerEvents = 'none';
                            const translate = getTranslateCSS(node);
                            node.style.transform = `${translate} scale(0.5)`;
                            node.classList.remove('active');
                        }
                        if (path) {
                            path.classList.remove('highlighted');
                        }
                    }
                });

                // Hide tooltip if scroll position is outside city triggers
                if (visibleCount === 0 || visibleCount > numCities) {
                    mapTooltip.style.opacity = '0';
                    mapTooltip.style.transform = 'translateY(10px)';
                    mapTooltip.style.pointerEvents = 'none';
                    setTimeout(() => {
                        if (mapTooltip.style.opacity === '0') {
                            mapTooltip.style.visibility = 'hidden';
                        }
                    }, 300);
                }
            } else {
                // If user is manual-hovering, still reveal nodes based on scroll progress
                // but do not force active state/tooltip updates
                cityKeys.forEach((cityKey, idx) => {
                    const node = mapSection.querySelector(`.city-node[data-city="${cityKey}"]`);
                    if (idx < visibleCount) {
                        if (node) {
                            node.style.opacity = '1';
                            node.style.pointerEvents = 'auto';
                            const translate = getTranslateCSS(node);
                            if (!node.classList.contains('active')) {
                                node.style.transform = `${translate} scale(1.0)`;
                            }
                        }
                    } else {
                        if (node) {
                            node.style.opacity = '0';
                            node.style.pointerEvents = 'none';
                            const translate = getTranslateCSS(node);
                            node.style.transform = `${translate} scale(0.5)`;
                            node.classList.remove('active');
                        }
                    }
                });
            }
        };
        
        // Initial run
        updateMapScroll();
    }

    // 9. FORMULAIRE DE CONTACT ET RETOUR D'INFORMATION LOCALISÉ (CONTACT FORM HANDLER)
    // Intercepte la soumission du formulaire de contact pour empêcher le rechargement brutal de la page.
    // Modifie le bouton d'envoi pour afficher une coche verte et un texte de succès traduit (FR, EN, ES, AR).
    // Réinitialise le formulaire et restaure l'état d'origine du bouton après un délai de 3 secondes.
    document.getElementById('contactForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = this.querySelector('button');
        const originalText = btn.innerHTML;
        
        // Define submit feedback messages
        const feedbackMsg = {
            fr: '<i class="fas fa-check"></i> Demande Envoyée',
            en: '<i class="fas fa-check"></i> Request Sent',
            es: '<i class="fas fa-check"></i> Solicitud Enviada',
            ar: '<i class="fas fa-check"></i> تم إرسال الطلب'
        };
        
        btn.innerHTML = feedbackMsg[currentLang] || feedbackMsg.fr;
        btn.style.backgroundColor = 'var(--color-gold)';
        btn.style.color = 'var(--color-charcoal)';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.backgroundColor = 'transparent';
            btn.style.color = 'var(--color-gold)';
            this.reset();
        }, 3000);
    });
});
