/* app.js — Manejo de interactividad (navegación parcial, modales, validación) */
document.addEventListener('DOMContentLoaded', () => {
  // ELEMENTOS
  const navGoButtons = document.querySelectorAll('[data-action="go"]');
  const panels = document.querySelectorAll('.panel');
  const dynamicContent = document.getElementById('dynamicContent');

  // Modales
  const detailModal = document.getElementById('detailModal');
  const modal = document.getElementById('modal');
  const modalCloseBtns = document.querySelectorAll('.modal-close');
  const openModalBtn = document.getElementById('openModalBtn');

  // Formulario principal
  const contactForm = document.getElementById('contactForm');
  const resetForm = document.getElementById('resetForm');

  /* 1) Navegación interna (muestra paneles locales) */
  function showLocalPanel(id) {
    panels.forEach(p => p.classList.remove('active'));
    const panel = document.getElementById(id);
    if (panel) {
      panel.classList.add('active');
      panel.scrollIntoView({behavior: 'smooth', block: 'start'});
      history.pushState({panel: id}, '', `#${id}`);
    }
  }

  navGoButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = btn.dataset.target;
      if (target) showLocalPanel(target);
    });
  });

  /* 2) Abrir páginas en dynamicContent por fetch (botones con data-action="open-page") */
  document.body.addEventListener('click', async (e) => {
    const open = e.target.closest('[data-action="open-page"]');
    if (!open) return;
    const page = open.dataset.page;
    if (!page) return;
    try {
      const res = await fetch(page);
      if (!res.ok) throw new Error('Error cargando página');
      const html = await res.text();
      dynamicContent.innerHTML = html;
      panels.forEach(p => p.classList.remove('active'));
      history.pushState({page}, '', `#page=${encodeURIComponent(page)}`);
      dynamicContent.scrollIntoView({behavior: 'smooth', block: 'start'});
    } catch (err) {
      dynamicContent.innerHTML = `<section class="panel"><h3>Error</h3><p>No fue posible cargar la página.</p></section>`;
    }
  });

  /* 3) Modal detalle de proyecto */
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="open-modal-detail"]');
    if (!btn) return;
    const title = btn.dataset.title || 'Detalle';
    const desc = btn.dataset.desc || '';
    document.getElementById('detailTitle').textContent = title;
    document.getElementById('detailBody').innerHTML = `<p>${desc}</p>`;
    detailModal.setAttribute('aria-hidden', 'false');
  });

  // Abrir modal general
  openModalBtn?.addEventListener('click', () => modal.setAttribute('aria-hidden', 'false'));

  // Cerrar modales
  modalCloseBtns.forEach(b => b.addEventListener('click', () => {
    b.closest('.modal').setAttribute('aria-hidden', 'true');
  }));
  // Cerrar modal si clic fuera del panel
  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', (e) => {
      if (e.target === m) m.setAttribute('aria-hidden', 'true');
    });
  });

  /* 4) Validación simple del formulario (local, simulado) */
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.querySelector('#name');
    const email = contactForm.querySelector('#email');
    const message = contactForm.querySelector('#message');

    if (!name.value || name.value.trim().length < 3) { alert('Nombre inválido (min 3 caracteres).'); name.focus(); return; }
    if (!email.value || !email.value.includes('@')) { alert('Email inválido.'); email.focus(); return; }
    if (!message.value || message.value.trim().length < 8) { alert('Mensaje muy corto.'); message.focus(); return; }

    // Simular envío
    alert('Formulario validado y (simulado) enviado. ¡Gracias!');
    contactForm.reset();
  });
  resetForm?.addEventListener('click', () => contactForm.reset());

  /* 5) Manejar history / back button para paneles locales y páginas cargadas */
  window.addEventListener('popstate', async (ev) => {
    const state = ev.state;
    if (!state) return;
    if (state.panel) {
      showLocalPanel(state.panel);
    } else if (state.page) {
      try {
        const res = await fetch(state.page);
        const html = await res.text();
        dynamicContent.innerHTML = html;
        panels.forEach(p => p.classList.remove('active'));
      } catch (err) { /* noop */ }
    }
  });

  /* 6) Pequeña animación: animate bars if present */
  document.querySelectorAll('.bar .fill').forEach(span => {
    const w = span.style.width;
    span.style.width = '0%';
    setTimeout(() => span.style.width = w, 200);
  });

  /* 7) Registrar Service Worker si existe (para extra) */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/js/sw.js').then(() => {
        // console.log('SW registrado');
      }).catch(() => {
        // console.log('SW fallo');
      });
    });
  }
});

// ===========================
// MODAL DETALLES DE PROYECTOS
// ===========================

const proyectos = {
  ventas: {
    titulo: "Sistema de Ventas (Académico)",
    img: "assets/img/proyecto1.jpg",
    desc: "Proyecto académico orientado al desarrollo de un sistema de ventas con registro de clientes, productos y facturación. Incluye CRUD completo y conexión con PostgreSQL.",
    detalles: [
      "Lenguajes: HTML, CSS, JavaScript, SQL",
      "Base de datos: PostgreSQL",
      "Objetivo: Control de ventas e inventarios",
      "Rol: Desarrollador Full Stack académico"
    ]
  },
  inventario: {
    titulo: "Gestión de Inventario",
    img: "assets/img/proyecto2.jpg",
    desc: "Aplicación desarrollada para controlar el stock de productos, registrar movimientos de entrada y salida, y generar reportes de existencias.",
    detalles: [
      "Lenguajes: Java y SQL",
      "Base de datos: MySQL",
      "Objetivo: Mantener control de inventario académico",
      "Rol: Desarrollador backend y modelador ER"
    ]
  },
  portafolio: {
    titulo: "Portafolio Web Personal",
    img: "assets/img/proyecto3.jpg",
    desc: "Sitio web personal diseñado con HTML, CSS y JavaScript para mostrar mis habilidades, experiencia y proyectos de desarrollo web.",
    detalles: [
      "Lenguajes: HTML, CSS, JavaScript",
      "Hosting: GitHub Pages",
      "Objetivo: Presentación profesional online",
      "Rol: Diseñador y desarrollador web"
    ]
  },
  tienda: {
    titulo: "Tienda Online",
    img: "assets/img/proyecto4.jpg",
    desc: "Prototipo de tienda online con catálogo de productos, filtros dinámicos y carrito de compras con almacenamiento local.",
    detalles: [
      "Lenguajes: HTML, CSS, JavaScript",
      "Framework: Bootstrap",
      "Objetivo: Simulación de e-commerce",
      "Rol: Desarrollador frontend"
    ]
  }
};

// Referencias
const modalProyecto = document.getElementById("modal-proyecto");
const modalTitle = document.getElementById("modal-title");
const modalImg = document.getElementById("modal-img");
const modalDesc = document.getElementById("modal-desc");
const modalList = document.getElementById("modal-list");
const closeModal = document.querySelector(".close-modal");

// Evento de apertura
document.querySelectorAll(".ver-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.proyecto;
    const data = proyectos[key];
    modalTitle.textContent = data.titulo;
    modalImg.src = data.img;
    modalDesc.textContent = data.desc;
    modalList.innerHTML = data.detalles.map(i => `<li>${i}</li>`).join("");
    modalProyecto.classList.add("active");
  });
});

// Cerrar modal
closeModal.addEventListener("click", () => {
  modalProyecto.classList.remove("active");
});

// Cerrar al hacer clic fuera
modalProyecto.addEventListener("click", e => {
  if (e.target === modalProyecto) modalProyecto.classList.remove("active");
});
