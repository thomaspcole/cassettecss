var u = Object.defineProperty;
var p = (i, t, s) => t in i ? u(i, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : i[t] = s;
var r = (i, t, s) => p(i, typeof t != "symbol" ? t + "" : t, s);
function o(i, t = document) {
  return Array.from(t.querySelectorAll(i));
}
function e(i, t, s, n) {
  i.addEventListener(t, s, n);
}
function l(i, t, s) {
  i.removeEventListener(t, s);
}
const d = class d {
  constructor(t, s = {}) {
    this.el = t, this.options = { ...d.defaults, ...s }, this._isOpen = !1, this._escHandler = null, this._init(), t._fwModal = this;
  }
  _init() {
    const t = this.el.id;
    t && o(`[data-fw-toggle="modal"][data-fw-target="#${t}"]`).forEach((s) => {
      e(s, "click", () => this.show());
    }), o('[data-fw-dismiss="modal"]', this.el).forEach((s) => {
      e(s, "click", () => this.hide());
    }), e(this.el, "click", (s) => {
      s.target === this.el && this.hide();
    });
  }
  show() {
    this.el.style.display = "flex", this._isOpen = !0, document.body.style.overflow = "hidden", this.el.dispatchEvent(new CustomEvent("fw:modal:show")), this.options.keyboard && (this._escHandler = (t) => {
      t.key === "Escape" && this.hide();
    }, e(document, "keydown", this._escHandler));
  }
  hide() {
    this.el.style.display = "none", this._isOpen = !1, document.body.style.overflow = "", this.el.dispatchEvent(new CustomEvent("fw:modal:hide")), this._escHandler && (l(document, "keydown", this._escHandler), this._escHandler = null);
  }
  static init(t = '[data-fw-component="modal"]') {
    o(t).forEach((s) => new d(s));
  }
  static getInstance(t) {
    return t._fwModal ?? null;
  }
};
r(d, "defaults", { keyboard: !0 });
let c = d;
class h {
  constructor(t, s = {}) {
    this.el = t, this.toggle = t.querySelector(".dropdown-toggle"), this.menu = t.querySelector(".dropdown-menu"), this.chevron = t.querySelector(".dropdown-chevron"), this._isOpen = !1, this._outsideHandler = null, this._init(), t._fwDropdown = this;
  }
  _init() {
    !this.toggle || !this.menu || (e(this.toggle, "click", () => {
      this._isOpen ? this.hide() : this.show();
    }), e(this.menu, "click", (t) => {
      t.target.closest(".dropdown-item") && !t.target.closest(".dropdown-item.is-disabled") && this.hide();
    }));
  }
  show() {
    var t;
    this.menu.style.display = "block", this._isOpen = !0, (t = this.chevron) == null || t.classList.add("is-open"), this.el.dispatchEvent(new CustomEvent("fw:dropdown:show")), this._outsideHandler = (s) => {
      this.el.contains(s.target) || this.hide();
    }, requestAnimationFrame(() => {
      e(document, "click", this._outsideHandler, { capture: !0 });
    });
  }
  hide() {
    var t;
    this.menu.style.display = "none", this._isOpen = !1, (t = this.chevron) == null || t.classList.remove("is-open"), this.el.dispatchEvent(new CustomEvent("fw:dropdown:hide")), this._outsideHandler && (l(document, "click", this._outsideHandler), this._outsideHandler = null);
  }
  static init(t = '[data-fw-component="dropdown"]') {
    o(t).forEach((s) => new h(s));
  }
  static getInstance(t) {
    return t._fwDropdown ?? null;
  }
}
class a {
  constructor(t, s = {}) {
    this.el = t, this.btn = t.querySelector(".accordion-btn"), this.body = t.querySelector(".accordion-body"), this.chevron = t.querySelector(".accordion-chevron"), this._isOpen = t.dataset.fwOpen === "true", this._init(), t._fwAccordion = this;
  }
  _init() {
    var s;
    if (!this.btn || !this.body) return;
    const t = document.createElement("div");
    for (t.className = "accordion-body-inner"; this.body.firstChild; ) t.appendChild(this.body.firstChild);
    this.body.appendChild(t), this._isOpen && (this.body.style.transition = "none", this.el.classList.add("is-open"), this.btn.classList.add("is-open"), (s = this.chevron) == null || s.classList.add("is-open"), requestAnimationFrame(() => {
      this.body.style.transition = "";
    })), e(this.btn, "click", () => this.toggle());
  }
  toggle() {
    this._isOpen ? this.close() : this.open();
  }
  open() {
    var s;
    this._isOpen = !0, this.el.classList.add("is-open"), this.btn.classList.add("is-open"), (s = this.chevron) == null || s.classList.add("is-open");
    const t = this.el.closest("[data-fw-accordion]");
    t && o('[data-fw-component="accordion"]', t).forEach((n) => {
      n !== this.el && n._fwAccordion && n._fwAccordion.close();
    }), this.el.dispatchEvent(new CustomEvent("fw:accordion:open"));
  }
  close() {
    var t;
    this._isOpen = !1, this.el.classList.remove("is-open"), this.btn.classList.remove("is-open"), (t = this.chevron) == null || t.classList.remove("is-open"), this.el.dispatchEvent(new CustomEvent("fw:accordion:close"));
  }
  static init(t = '[data-fw-component="accordion"]') {
    o(t).forEach((s) => new a(s));
  }
  static getInstance(t) {
    return t._fwAccordion ?? null;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  c.init(), h.init(), a.init();
});
const f = { Modal: c, Dropdown: h, Accordion: a };
window.CassetteCSS = f;
export {
  a as Accordion,
  h as Dropdown,
  c as Modal,
  f as default
};
