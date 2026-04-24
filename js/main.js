function getPathBasename(pathname) {
  const raw = (pathname || "").split("?")[0].split("#")[0];
  const parts = raw.split("/").filter(Boolean);
  return parts.length ? parts[parts.length - 1] : "";
}

function setActiveNav() {
  const basename = getPathBasename(window.location.pathname);
  const page =
    basename === "" || basename.toLowerCase() === "index.html"
      ? "home"
      : basename.replace(".html", "").toLowerCase();

  const links = document.querySelectorAll(".nav-links a[data-nav]");
  links.forEach((a) => {
    const key = a.getAttribute("data-nav");
    if (key === page) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

function setupMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const panel = document.querySelector("[data-collapsible]");
  if (!toggle || !panel) return;

  const setExpanded = (open) => {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    panel.classList.toggle("is-open", open);
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    setExpanded(!open);
  });

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Node)) return;
    if (!panel.classList.contains("is-open")) return;
    if (panel.contains(target) || toggle.contains(target)) return;
    setExpanded(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setExpanded(false);
  });
}

function setFooterYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());
}

function setupProjectFilters() {
  const filterButtons = document.querySelectorAll("[data-filter]");
  const grid = document.querySelector("[data-projects]");
  if (!filterButtons.length || !grid) return;

  const cards = Array.from(grid.querySelectorAll("[data-tags]"));
  const setActiveButton = (btn) => {
    filterButtons.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
  };

  const applyFilter = (tag) => {
    const normalized = String(tag || "").trim().toLowerCase();
    cards.forEach((card) => {
      const tags = String(card.getAttribute("data-tags") || "")
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);

      const show = normalized === "all" ? true : tags.includes(normalized);
      card.style.display = show ? "" : "none";
    });
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      setActiveButton(btn);
      applyFilter(btn.getAttribute("data-filter"));
    });
  });
}

function setupContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!(form instanceof HTMLFormElement)) return;

  const success = document.querySelector("[data-form-success]");
  const errorFor = (name) =>
    document.querySelector(`[data-error-for="${CSS.escape(name)}"]`);

  const setError = (name, msg) => {
    const el = errorFor(name);
    if (el) el.textContent = msg || "";
  };

  const get = (name) => {
    const el = form.elements.namedItem(name);
    return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement
      ? el
      : null;
  };

  const validate = () => {
    const name = get("name");
    const email = get("email");
    const message = get("message");

    let ok = true;
    if (success) success.textContent = "";

    setError("name", "");
    setError("email", "");
    setError("message", "");

    if (!name || !name.value.trim()) {
      ok = false;
      setError("name", "Please enter your name.");
    }

    const emailVal = email?.value.trim() || "";
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
    if (!emailVal) {
      ok = false;
      setError("email", "Please enter your email.");
    } else if (!emailOk) {
      ok = false;
      setError("email", "Please enter a valid email address.");
    }

    if (!message || !message.value.trim()) {
      ok = false;
      setError("message", "Please enter a message.");
    }

    return ok;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) return;
    form.reset();
    if (success) success.textContent = "Thanks! Your message is ready to send.";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  setupMobileNav();
  setFooterYear();
  setupProjectFilters();
  setupContactForm();
});
