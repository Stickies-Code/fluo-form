/* flu–o · interacciones y animaciones */
(() => {
  /* Casos: pestañas y comparador antes/después */
  function initCases(animate) {
    const tabs = document.querySelectorAll('.case-tab');
    const show = (key) => {
      tabs.forEach((t) => { const on = t.id === 'tab-' + key; t.classList.toggle('is-active', on); t.setAttribute('aria-selected', on); });
      document.querySelectorAll('.case').forEach((c) => { const on = c.id === 'case-' + key; c.hidden = !on; c.classList.toggle('is-active', on); });
      if (animate && window.gsap) gsap.from('#case-' + key + ' .cph', { y: 24, opacity: 0, duration: .7, ease: 'expo.out', stagger: .08 });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    };
    tabs.forEach((t) => t.addEventListener('click', () => show(t.id.replace('tab-', ''))));

  }

  // Datos de contacto: rellenar cuando estén listos
  const CONTACT = {
    email: 'fluoequipos@gmail.com',
    // Formulario «Solicita tu plaza» → tabla «solicitudes» de Supabase (solo inserción, protegida con RLS)
    supabaseUrl: 'https://jakaqszmgachfgeitnfq.supabase.co',
    supabaseAnonKey: 'sb_publishable_N4xtiZERqIdGK-CxETzRew_H1ztsXjb',
  };

  const emailBtn = document.querySelector('[data-contact="email"]');
  if (emailBtn) {
    if (CONTACT.email) { emailBtn.href = 'mailto:' + CONTACT.email; emailBtn.textContent = CONTACT.email; }
    else emailBtn.style.display = 'none';
  }


  /* ---------- Formulario «Solicita tu plaza» ---------- */
  const rform = document.getElementById('rform');
  if (rform) {
    const msg = rform.querySelector('.rmsg');
    const btn = rform.querySelector('button[type="submit"]');
    const fields = ['nombre', 'telefono', 'redes'].map((n) => rform.elements[n]);
    const check = rform.elements.privacidad;
    const validPhone = (v) => v.replace(/[^0-9]/g, '').length >= 9 || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
    const validate = () => {
      let ok = true;
      fields.forEach((f) => {
        const bad = !f.value.trim() || (f.name === 'telefono' && !validPhone(f.value));
        f.classList.toggle('bad', bad);
        if (bad) ok = false;
      });
      check.closest('.rcheck').classList.toggle('bad', !check.checked);
      if (!check.checked) ok = false;
      return ok;
    };
    fields.forEach((f) => { f.addEventListener('input', () => f.classList.remove('bad')); f.addEventListener('change', () => f.classList.remove('bad')); });
    const done = (nombre) => {
      rform.classList.add('sent');
      rform.innerHTML = '<div class="rdone"><i><svg viewBox="0 0 24 24" fill="none" stroke="#0E0E10" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></i><h3>¡Gracias, ' + nombre.replace(/[<>&]/g, '') + '!</h3><p>Preparamos la revisión de tus redes y te contactamos en menos de 48 horas.</p></div>';
    };
    rform.addEventListener('submit', async (e) => {
      e.preventDefault();
      msg.className = 'rmsg'; msg.textContent = '';
      if (rform.elements._gotcha.value) return;
      if (!validate()) { msg.className = 'rmsg err'; msg.textContent = 'Revisa los campos marcados.'; return; }
      const data = {
        nombre: rform.elements.nombre.value.trim(),
        apellidos: '',
        telefono: rform.elements.telefono.value.trim(),
        empresa: 'Redes: ' + rform.elements.redes.value.trim(),
        privacidad: true,
      };
      data._subject = 'Nueva revisión de redes gratis · flu–o';
      if (!CONTACT.supabaseUrl || !CONTACT.supabaseAnonKey) {
        const body = `Nombre: ${data.nombre}%0D%0AContacto: ${data.telefono}%0D%0A${encodeURIComponent(data.empresa)}`;
        window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(data._subject)}&body=${body}`;
        msg.className = 'rmsg ok';
        msg.textContent = 'Te hemos abierto el correo con tus datos: solo tienes que darle a enviar.';
        return;
      }
      btn.disabled = true; btn.querySelector('.rbtn-t').textContent = 'Enviando…';
      try {
        const { _subject, ...row } = data;
        const r = await fetch(CONTACT.supabaseUrl + '/rest/v1/solicitudes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: CONTACT.supabaseAnonKey,
            Prefer: 'return=minimal',
          },
          body: JSON.stringify(row),
        });
        if (!r.ok) throw new Error('send');
        done(data.nombre);
      } catch (err) {
        btn.disabled = false; btn.querySelector('.rbtn-t').textContent = 'Quiero mi revisión gratis';
        msg.className = 'rmsg err';
        msg.textContent = 'No se ha podido enviar. Escríbenos a ' + CONTACT.email;
      }
    });
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !window.gsap || !window.ScrollTrigger) { initCases(false); return; }

  gsap.registerPlugin(ScrollTrigger);
  const EASE = 'expo.out';

  /* ---------- Enlaces internos ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const y = id === '#top' ? 0 : el.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  /* ---------- HERO: estado inicial ---------- */
  const q = (s) => document.querySelector(s);
  const qa = (s) => gsap.utils.toArray(s);
  const nav = q('#nav');

  gsap.set(nav, { yPercent: -110 });
  gsap.set('.h-eyebrow', { opacity: 0, y: 16 });
  gsap.set('.hero-title .line-in', { yPercent: 115 });
  gsap.set('.h-icons img', { opacity: 0, scale: 0.6, y: 24 });
  gsap.set(['.h-social-txt', '.hero-sub'], { opacity: 0, y: 18 });
  gsap.set('.h-final', { opacity: 0, y: 28 });
  gsap.set('.h-blob', { opacity: 0, scale: 0.4, rotate: -40 });
  gsap.set('.phone', { y: () => window.innerHeight, rotate: 6 });
  gsap.set('.post', { opacity: 0, scale: 0.85 });
  gsap.set('.toast', { opacity: 0, scale: 0.9, y: 16, filter: 'blur(6px)' });

  /* ---------- HERO: intro del logo (la gota que viaja entre flu y o) ---------- */
  const intro = gsap.timeline({ delay: 0.15 });
  intro
    .from('.bl-flu', { x: -60, opacity: 0, duration: 1, ease: EASE })
    .from('.bl-o', { x: 60, opacity: 0, duration: 1, ease: EASE }, '<')
    .from('.bl-pill', { y: -260, opacity: 0, scaleX: 0.5, scaleY: 1.6, duration: 0.6, ease: 'power3.in' }, 0.25)
    .to('.bl-pill', { scaleX: 1.3, scaleY: 0.7, duration: 0.12, ease: 'power2.out' })
    .to('.bl-pill', { scaleX: 1, scaleY: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' })
    .to('.bl-pill', { x: '-0.09em', duration: 0.35, ease: 'power2.inOut' }, '-=0.3')
    .to('.bl-pill', { x: '0.09em', duration: 0.4, ease: 'power2.inOut' })
    .to('.bl-pill', { x: 0, duration: 0.6, ease: 'elastic.out(1, 0.55)' })
    .from('.scroll-hint', { opacity: 0, y: 12, duration: 0.6, ease: EASE }, '-=0.5');

  /* ---------- HERO: 3 desplazamientos ---------- */
  const dots = qa('.scroll-dots i');
  const counter = q('.ig-stats .count');
  const countObj = { v: 0 };
  let heroDir = 1;

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: '+=300%',
      pin: true,
      scrub: 0.6,
      snap: {
        // cada gesto lleva al siguiente (o anterior) paso: 3 desplazamientos
        snapTo: () => {
          const pos = tl.scrollTrigger.progress * 3;
          const t = heroDir > 0 ? Math.ceil(pos - 0.04) : Math.floor(pos + 0.04);
          return gsap.utils.clamp(0, 3, t) / 3;
        },
        duration: { min: 0.35, max: 0.8 }, delay: 0.06, ease: 'power2.inOut',
      },
      onUpdate: (self) => {
        if (self.direction) heroDir = self.direction;
        const step = Math.round(self.progress * 3);
        dots.forEach((d, i) => d.classList.toggle('on', i < step));
      },
    },
  });

  tl.addLabel('s0', 0)
    // 1 · el logo deja paso al lema
    .to('.hero-biglogo', { scale: 0.32, yPercent: -46, opacity: 0, duration: 0.8, ease: 'power2.in' }, 0)
    .to(nav, { yPercent: 0, duration: 0.5 }, 0.45)
    .to('.h-eyebrow', { opacity: 1, y: 0, duration: 0.5 }, 0.4)
    .to('.hero-title .line-in', { yPercent: 0, duration: 0.6, stagger: 0.12 }, 0.4)
    .to('.h-blob', { opacity: 1, scale: 1, rotate: -18, duration: 0.8 }, 0.25)
    .addLabel('s1', 1)
    // 2 · qué redes y cómo
    .to('.h-icons img', { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.8)' }, 1.05)
    .to('.h-social-txt', { opacity: 1, y: 0, duration: 0.5 }, 1.25)
    .to('.hero-sub', { opacity: 1, y: 0, duration: 0.5 }, 1.4)
    .to('.h-blob', { rotate: -6, xPercent: 6, duration: 0.9, ease: 'power2.inOut' }, 1.05)
    .addLabel('s2', 2)
    // 3 · la pantalla completa
    .to('.phone', { y: 0, rotate: 0, duration: 0.7 }, 2.02)
    .to('.h-blob', { scale: 0.82, rotate: -14, xPercent: 0, duration: 0.7, ease: 'power2.inOut' }, 2.02)
    .to('.post', { opacity: 1, scale: 1, duration: 0.3, stagger: 0.04 }, 2.4)
    .to(countObj, { v: 128, duration: 0.5, ease: 'power2.out', onUpdate: () => { if (counter) counter.textContent = Math.round(countObj.v); } }, 2.4)
    .to('.toast', { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 0.35, stagger: 0.12 }, 2.55)
    .to('.h-final', { opacity: 1, y: 0, duration: 0.5 }, 2.3)
    .to('.scroll-hint', { opacity: 0, duration: 0.3 }, 2.6)
    .addLabel('s3', 3);

  // vida propia de las notificaciones una vez montadas
  qa('.toast').forEach((t, i) => {
    gsap.to(t, { y: '+=8', duration: 2.4 + i * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.3 });
  });

  /* ---------- NAV sobre secciones claras ---------- */
  qa('.how, .incl, .faq').forEach((sec) => {
    ScrollTrigger.create({ trigger: sec, start: 'top 36px', end: 'bottom 36px', toggleClass: { targets: nav, className: 'on-light' } });
  });

  /* ---------- Apariciones ---------- */
  gsap.set('.reveal', { opacity: 0, y: 32, filter: 'blur(8px)' });
  ScrollTrigger.batch('.reveal', {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: EASE, stagger: 0.08, overwrite: true }),
  });

  /* ---------- Frase que se ilumina al deslizar ---------- */
  const st = q('#statement');
  if (st) {
    const green = ['menos', 'de', '3', 'horas'];
    st.innerHTML = st.textContent.trim().split(/\s+/).map((w) => {
      const clean = w.replace(/[.,]/g, '');
      return `<span class="w${green.includes(clean) ? ' g' : ''}">${w}</span>`;
    }).join(' ');
    const words = qa('#statement .w');
    words.forEach((w) => {
      gsap.to(w, {
        color: w.classList.contains('g') ? '#D4FF3A' : '#FFFFFF',
        ease: 'none',
        scrollTrigger: { trigger: w, start: 'top 82%', end: 'top 58%', scrub: true },
      });
    });
  }

  /* ---------- Barras de los pasos ---------- */
  qa('.step-bar i').forEach((bar) => {
    gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: bar, start: 'top 85%', end: 'top 45%', scrub: true } });
  });

  /* ---------- Editor de vídeo ---------- */
  const editor = q('.editor');
  if (editor) {
    gsap.set('.clips i', { scaleX: 0 });
    gsap.set('.ed-sub span', { opacity: 0, y: 10 });
    const ed = gsap.timeline({ paused: true });
    ed.to('.clips i', { scaleX: 1, duration: 0.7, stagger: 0.06, ease: EASE })
      .to('.ed-sub span', { opacity: 1, y: 0, duration: 0.5, stagger: 0.15, ease: 'back.out(2)' }, 0.3);
    ScrollTrigger.create({ trigger: editor, start: 'top 75%', once: true, onEnter: () => ed.play() });

    const tracks = q('.ed-tracks');
    const label = q('.track label');
    gsap.to('.playhead', {
      x: () => tracks.offsetWidth - label.offsetWidth - 16,
      duration: 6,
      ease: 'none',
      repeat: -1,
    });
  }

  /* ---------- Bento: ligera profundidad al deslizar ---------- */
  gsap.to('.b-big .b-n', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.bento', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* ---------- Logo final: la gota vuelve a su sitio ---------- */
  gsap.from('.final-logo .pill', { x: '-0.6em', scaleX: 2.2, ease: 'elastic.out(1,0.5)', duration: 1.4, scrollTrigger: { trigger: '.final-logo', start: 'top 80%' } });


  /* ---------- Casos de éxito: pestañas + comparador ---------- */
  initCases(true);
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
