/* d_d GYM — site scripts (externalized so the CSP can drop script-src 'unsafe-inline') */

/* Analytics (GA4 + Microsoft Clarity): deferred to first interaction or idle */
(function () {
    var GA_ID = 'G-G0WSZX6906';
    var CLARITY_ID = 'wwjrqeno23';
    var started = false;
    function loadAnalytics() {
        if (started) return;
        started = true;
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(s);
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', GA_ID);
        (function (c, l, a, r, i, t, y) {
            c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
            t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
            y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
        })(window, document, 'clarity', 'script', CLARITY_ID);
    }
    var events = ['pointerdown', 'keydown', 'touchstart', 'scroll'];
    function onFirst() {
        events.forEach(function (e) { window.removeEventListener(e, onFirst, { passive: true }); });
        loadAnalytics();
    }
    events.forEach(function (e) { window.addEventListener(e, onFirst, { passive: true }); });
    window.addEventListener('load', function () {
        if ('requestIdleCallback' in window) requestIdleCallback(loadAnalytics, { timeout: 5000 });
        else setTimeout(loadAnalytics, 4000);
    });
})();

/* Mobile menu toggle */
(function () {
    var toggle = document.getElementById('mobile-menu-toggle');
    var menu = document.getElementById('mobile-menu');
    var icon = document.getElementById('mobile-menu-icon');
    if (!toggle || !menu || !icon) return;

    var MENU_D = 'M120-240v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z';
    var CLOSE_D = 'm249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z';
    function setIcon(d) {
        var p = icon.querySelector('path');
        if (p) p.setAttribute('d', d);
    }
    function closeMenu() {
        menu.classList.add('hidden');
        toggle.setAttribute('aria-expanded', 'false');
        setIcon(MENU_D);
    }
    function openMenu() {
        menu.classList.remove('hidden');
        toggle.setAttribute('aria-expanded', 'true');
        setIcon(CLOSE_D);
    }
    toggle.addEventListener('click', function () {
        if (menu.classList.contains('hidden')) openMenu();
        else closeMenu();
    });
    menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });
})();

/* Modals (privacy / terms) */
(function () {
    function openModal(id) {
        var modal = document.getElementById(id);
        if (!modal) return;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }
    function closeModal(id) {
        var modal = document.getElementById(id);
        if (!modal) return;
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
    }
    document.querySelectorAll('[data-modal-open]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            openModal(btn.getAttribute('data-modal-open'));
        });
    });
    document.querySelectorAll('[data-modal-close]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            closeModal(btn.getAttribute('data-modal-close'));
        });
    });
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        ['privacy-modal', 'terms-modal'].forEach(function (id) {
            var m = document.getElementById(id);
            if (m && !m.classList.contains('hidden')) closeModal(id);
        });
    });
})();

/* Scroll reveal */
(function () {
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('main > section').forEach(function (section) {
        section.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-10');
        observer.observe(section);
    });
})();

/* Motion-reactive hero orbs: pointer + scroll + device tilt, with gentle auto-drift */
(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var orbs = document.querySelectorAll('.parallax-orb');
    var hero = document.querySelector('.vitality-gradient');
    if (!orbs.length || !hero) return;

    var px = 0, py = 0;
    var cx = 0, cy = 0;
    var scrollY = 0;

    window.addEventListener('pointermove', function (e) {
        px = (e.clientX / window.innerWidth) - 0.5;
        py = (e.clientY / window.innerHeight) - 0.5;
    }, { passive: true });

    window.addEventListener('deviceorientation', function (e) {
        if (e.gamma == null || e.beta == null) return;
        px = Math.max(-1, Math.min(1, e.gamma / 40));
        py = Math.max(-1, Math.min(1, (e.beta - 45) / 40));
    }, true);

    window.addEventListener('scroll', function () {
        scrollY = window.scrollY || window.pageYOffset || 0;
    }, { passive: true });

    function frame(t) {
        cx += (px - cx) * 0.06;
        cy += (py - cy) * 0.06;
        for (var i = 0; i < orbs.length; i++) {
            var o = orbs[i];
            var d = parseFloat(o.getAttribute('data-depth')) || 20;
            var driftX = Math.cos(t / 4200 + i * 1.7) * (d * 0.35);
            var driftY = Math.sin(t / 3600 + i * 2.1) * (d * 0.35);
            var tx = cx * d * 1.6 + driftX;
            var ty = cy * d * 1.6 + driftY + scrollY * (d * 0.012);
            o.style.transform = 'translate3d(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px,0)';
        }
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
})();

/* Formspree init (queue is consumed by the self-hosted SDK loaded after this file) */
window.formspree = window.formspree || function () { (formspree.q = formspree.q || []).push(arguments); };
formspree('initForm', { formElement: '#contact-form', formId: 'xwvznzez' });

/* Naver Map: loaded lazily only when the "오시는 길" section nears the viewport */
(function () {
    var target = document.getElementById('map');
    if (!target) return;
    var loaded = false;
    function initMap() {
        if (typeof naver === 'undefined' || !naver.maps) return;
        var pos = new naver.maps.LatLng(37.74044466113, 127.035134903668);
        var map = new naver.maps.Map('map', { center: pos, zoom: 16 });
        new naver.maps.Marker({ position: pos, map: map });
    }
    function loadMap() {
        if (loaded) return;
        loaded = true;
        var s = document.createElement('script');
        s.src = 'https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=lajkpeiv5b';
        s.onload = initMap;
        document.head.appendChild(s);
    }
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { io.disconnect(); loadMap(); }
            });
        }, { rootMargin: '300px' });
        io.observe(target);
    } else {
        window.addEventListener('load', loadMap);
    }
})();
