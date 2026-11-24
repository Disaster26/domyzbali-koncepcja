(function () {
  var top = document.getElementById('top'), mob = document.getElementById('mob');
  function scr() {
    var y = window.scrollY;
    top.classList.toggle('stale', y > 40 || document.getElementById('nav').classList.contains('otw'));
    if (mob) mob.classList.toggle('wid', y > window.innerHeight * 0.7);
  }
  window.addEventListener('scroll', scr, { passive: true }); scr();

  var b = document.getElementById('burger'), nav = document.getElementById('nav');
  b.addEventListener('click', function () {
    var o = nav.classList.toggle('otw');
    b.setAttribute('aria-expanded', o); b.setAttribute('aria-label', o ? 'Zamknij menu' : 'Otwórz menu'); scr();
  });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') { nav.classList.remove('otw'); b.setAttribute('aria-expanded', 'false'); scr(); } });

  var rok = document.getElementById('rok'); if (rok) rok.textContent = new Date().getFullYear();

  // cennik: zakładki
  var tabs = document.querySelectorAll('.zakl [role=tab]');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.setAttribute('aria-selected', x === t); document.getElementById(x.getAttribute('aria-controls')).hidden = x !== t; });
    });
  });

  // realizacje: przesuwanie palcem, myszą i strzałkami
  var tor = document.getElementById('tor');
  if (tor) {
    var krok = function () { return Math.max(tor.clientWidth * 0.8, 280); };
    document.getElementById('torP').onclick = function () { tor.scrollBy({ left: -krok() }); };
    document.getElementById('torN').onclick = function () { tor.scrollBy({ left: krok() }); };
    var dn = false, sx = 0, sl = 0, ruch = 0;
    tor.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; dn = true; ruch = 0; sx = e.clientX; sl = tor.scrollLeft; tor.classList.add('ciag'); });
    window.addEventListener('pointermove', function (e) { if (!dn) return; ruch = Math.abs(e.clientX - sx); tor.scrollLeft = sl - (e.clientX - sx); });
    window.addEventListener('pointerup', function () { if (!dn) return; dn = false; tor.classList.remove('ciag'); });

    var lb = document.getElementById('lb');
    if (!lb) {
      lb = document.createElement('dialog'); lb.className = 'lb'; lb.id = 'lb'; lb.setAttribute('aria-label', 'Powiększone zdjęcie');
      lb.innerHTML = '<img id="lbImg" alt=""><button class="lb-x" aria-label="Zamknij">×</button><button class="lb-p" aria-label="Poprzednie zdjęcie">‹</button><button class="lb-n" aria-label="Następne zdjęcie">›</button>';
      document.body.appendChild(lb);
    }
    var items = Array.prototype.slice.call(tor.querySelectorAll('button')), idx = 0, img = lb.querySelector('img');
    function pokaz(i) { idx = (i + items.length) % items.length; var s = items[idx].querySelector('img'); img.src = s.src; img.alt = s.alt; }
    items.forEach(function (it, i) { it.addEventListener('click', function (e) { if (ruch > 6) { e.preventDefault(); return; } pokaz(i); lb.showModal(); }); });
    lb.querySelector('.lb-x').onclick = function () { lb.close(); };
    lb.querySelector('.lb-p').onclick = function () { pokaz(idx - 1); };
    lb.querySelector('.lb-n').onclick = function () { pokaz(idx + 1); };
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') pokaz(idx - 1); if (e.key === 'ArrowRight') pokaz(idx + 1); });
  }

  // mapa Google dopiero na kliknięcie
  var mb = document.getElementById('mapaBtn');
  if (mb) mb.addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.title = 'Mapa Google - Łazy 95, 07-130 Łochów'; f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
    f.src = 'https://maps.google.com/maps?q=' + encodeURIComponent('Łazy 95, 07-130 Łochów') + '&z=14&output=embed';
    document.getElementById('mapa').replaceChildren(f);
  });

  var form = document.getElementById('form');
  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); document.getElementById('fInfo').hidden = false; });
})();
