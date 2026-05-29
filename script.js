document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const toggleBtn = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("active");
      body.classList.toggle("nav-open", isOpen);
      toggleBtn.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        body.classList.remove("nav-open");
        toggleBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  document.querySelectorAll("[data-count]").forEach((counter) => {
    const target = Number(counter.dataset.count || 0);
    const suffix = counter.dataset.suffix || "";
    const duration = 1400;

    const animate = () => {
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate();
          observer.disconnect();
        }
      });
    }, { threshold: 0.35 });

    observer.observe(counter);
  });

  const tabButtons = document.querySelectorAll("[data-agent-tab]");
  const agentPanels = document.querySelectorAll("[data-agent-panel]");
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.agentTab;
      tabButtons.forEach((item) => item.classList.toggle("active", item === button));
      agentPanels.forEach((panel) => panel.classList.toggle("active", panel.dataset.agentPanel === key));
    });
  });

  const filterButtons = document.querySelectorAll("[data-filter]");
  const caseCards = document.querySelectorAll("[data-case-tags]");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => item.classList.toggle("active", item === button));
      caseCards.forEach((card) => {
        const tags = card.dataset.caseTags.split(" ");
        const visible = filter === "all" || tags.includes(filter);
        card.classList.toggle("visible", visible);
      });
    });
  });

  const backToTop = document.createElement("button");
  backToTop.className = "back-to-top";
  backToTop.type = "button";
  backToTop.setAttribute("aria-label", "Retour en haut");
  backToTop.textContent = "↑";
  document.body.appendChild(backToTop);
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("show", window.scrollY > 560);
  }, { passive: true });

  const consentKey = "seven-yes-cookie-consent";
  if (!localStorage.getItem(consentKey)) {
    const banner = document.createElement("div");
    banner.className = "cookie-banner show";
    banner.innerHTML = `
      <p><strong>Confidentialité.</strong> Nous utilisons uniquement des cookies nécessaires et des mesures anonymisées pour améliorer ce site d'agence IA.</p>
      <div class="cookie-actions">
        <button class="btn btn-outline" type="button" data-cookie="declined">Refuser</button>
        <button class="btn" type="button" data-cookie="accepted">Accepter</button>
      </div>
    `;
    document.body.appendChild(banner);
    banner.querySelectorAll("[data-cookie]").forEach((button) => {
      button.addEventListener("click", () => {
        localStorage.setItem(consentKey, button.dataset.cookie);
        banner.classList.remove("show");
      });
    });
  }

  document.querySelectorAll(".contact-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      let valid = true;
      form.querySelectorAll("[required]").forEach((field) => {
        const error = form.querySelector(`[data-error-for="${field.id}"]`);
        const empty = !field.value.trim();
        const badEmail = field.type === "email" && field.value && !field.validity.valid;
        const message = empty ? "Ce champ est requis." : badEmail ? "Indiquez un email professionnel valide." : "";
        if (error) error.textContent = message;
        field.setAttribute("aria-invalid", String(Boolean(message)));
        valid = valid && !message;
      });

      if (!valid) {
        event.preventDefault();
        const status = form.querySelector(".form-status");
        if (status) status.textContent = "Merci de corriger les champs signalés.";
      }
    });
  });
});
