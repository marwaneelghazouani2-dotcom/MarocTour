document.addEventListener("DOMContentLoaded", () => {
    // 0. LANGUAGE SETUP
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

    // 1. DYNAMIC PRELOADER INJECTION
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

    // 2. DYNAMIC NAVBAR INJECTION
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

    // 3. DYNAMIC SCROLL TRACKER INJECTION
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

    // 4. DYNAMIC FOOTER INJECTION
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

    // 5. DOM TRANSLATION ENGINE
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

    // 6. NAVBAR SCROLL EFFECT
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

    // 7. KINETIC TYPOGRAPHY & PARALLAX ON SCROLL
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

    // 8. INTERSECTION OBSERVER FOR REVEALS
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

    // 8.1. INTERACTIVE MOROCCO MAP LOGIC
    const mapSection = document.getElementById('interactive-map');
    let updateMapScroll = null;
    
    if (mapSection) {
        const cityNodes = mapSection.querySelectorAll('.city-node');
        const regionPaths = mapSection.querySelectorAll('.region-path');
        const mapTooltip = document.getElementById('map-tooltip');
        const connectionLine = mapSection.querySelector('.map-connection-line');
        const stickyMapContainer = mapSection.querySelector('.sticky-map-container');
        let tooltipTimeout;
        let isHoveringTooltip = false;
        let isHoveringMapNode = false;

        // Helper to convert SVG translate(X, Y) to standard CSS translate(Xpx, Ypx)
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

        // The scroll update function
        updateMapScroll = function() {
            const rect = mapSection.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Check if map is in view
            if (rect.bottom < 0 || rect.top > viewportHeight) {
                return;
            }
            
            const totalScrollable = rect.height - viewportHeight;
            let progress = 0;
            if (totalScrollable > 0) {
                progress = -rect.top / totalScrollable;
            }
            progress = Math.min(1, Math.max(0, progress));
            
            const numCities = cityKeys.length;
            // Map progress to segments:
            const visibleCount = Math.floor(progress * (numCities + 1));
            
            // Draw connection line stroke-dashoffset
            if (connectionLine) {
                const length = connectionLine.getTotalLength();
                connectionLine.style.strokeDashoffset = length * (1 - progress);
            }
            
            // Update node visibility and active state if the user is not manual-hovering
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

    // 9. Prevent form submission reload and localize submit
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
