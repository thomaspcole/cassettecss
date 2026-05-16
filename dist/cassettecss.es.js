var p = Object.defineProperty;
var u = (e, t, s) => t in e ? p(e, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[t] = s;
var c = (e, t, s) => u(e, typeof t != "symbol" ? t + "" : t, s);
function o(e, t = document) {
  return Array.from(t.querySelectorAll(e));
}
function i(e, t, s, n) {
  e.addEventListener(t, s, n);
}
function r(e, t, s) {
  e.removeEventListener(t, s);
}
const l = class l {
  constructor(t, s = {}) {
    this.el = t, this.options = { ...l.defaults, ...s }, this._isOpen = !1, this._escHandler = null, this._init(), t._fwModal = this;
  }
  _init() {
    const t = this.el.id;
    t && o(`[data-fw-toggle="modal"][data-fw-target="#${t}"]`).forEach((s) => {
      i(s, "click", () => this.show());
    }), o('[data-fw-dismiss="modal"]', this.el).forEach((s) => {
      i(s, "click", () => this.hide());
    }), i(this.el, "click", (s) => {
      s.target === this.el && this.hide();
    });
  }
  show() {
    this.el.style.display = "flex", this._isOpen = !0, document.body.style.overflow = "hidden", this.el.dispatchEvent(new CustomEvent("fw:modal:show")), this.options.keyboard && (this._escHandler = (t) => {
      t.key === "Escape" && this.hide();
    }, i(document, "keydown", this._escHandler));
  }
  hide() {
    this.el.style.display = "none", this._isOpen = !1, document.body.style.overflow = "", this.el.dispatchEvent(new CustomEvent("fw:modal:hide")), this._escHandler && (r(document, "keydown", this._escHandler), this._escHandler = null);
  }
  static init(t = '[data-fw-component="modal"]') {
    o(t).forEach((s) => new l(s));
  }
  static getInstance(t) {
    return t._fwModal ?? null;
  }
};
c(l, "defaults", { keyboard: !0 });
let d = l;
class h {
  constructor(t, s = {}) {
    this.el = t, this.toggle = t.querySelector(".dropdown-toggle"), this.menu = t.querySelector(".dropdown-menu"), this.chevron = t.querySelector(".dropdown-chevron"), this._isOpen = !1, this._outsideHandler = null, this._init(), t._fwDropdown = this;
  }
  _init() {
    !this.toggle || !this.menu || (i(this.toggle, "click", () => {
      this._isOpen ? this.hide() : this.show();
    }), i(this.menu, "click", (t) => {
      t.target.closest(".dropdown-item") && !t.target.closest(".dropdown-item.is-disabled") && this.hide();
    }));
  }
  show() {
    var t;
    this.menu.style.display = "block", this._isOpen = !0, (t = this.chevron) == null || t.classList.add("is-open"), this.el.dispatchEvent(new CustomEvent("fw:dropdown:show")), this._outsideHandler = (s) => {
      this.el.contains(s.target) || this.hide();
    }, requestAnimationFrame(() => {
      i(document, "click", this._outsideHandler, { capture: !0 });
    });
  }
  hide() {
    var t;
    this.menu.style.display = "none", this._isOpen = !1, (t = this.chevron) == null || t.classList.remove("is-open"), this.el.dispatchEvent(new CustomEvent("fw:dropdown:hide")), this._outsideHandler && (r(document, "click", this._outsideHandler), this._outsideHandler = null);
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
    this.el = t, this.btn = t.querySelector(".accordion-btn"), this.body = t.querySelector(".accordion-body"), this.chevron = t.querySelector(".accordion-chevron"), this._isOpen = t.dataset.fwOpen === "true", this._init(), t._fwCollapse = this;
  }
  _init() {
    var t;
    !this.btn || !this.body || (this._isOpen ? (this.btn.classList.add("is-open"), (t = this.chevron) == null || t.classList.add("is-open")) : this.body.style.display = "none", i(this.btn, "click", () => this.toggle()));
  }
  toggle() {
    this._isOpen ? this.close() : this.open();
  }
  open() {
    var s;
    this.body.style.display = "block", this._isOpen = !0, this.btn.classList.add("is-open"), (s = this.chevron) == null || s.classList.add("is-open");
    const t = this.el.closest("[data-fw-accordion]");
    t && o('[data-fw-component="collapse"]', t).forEach((n) => {
      n !== this.el && n._fwCollapse && n._fwCollapse.close();
    }), this.el.dispatchEvent(new CustomEvent("fw:collapse:open"));
  }
  close() {
    var t;
    this.body.style.display = "none", this._isOpen = !1, this.btn.classList.remove("is-open"), (t = this.chevron) == null || t.classList.remove("is-open"), this.el.dispatchEvent(new CustomEvent("fw:collapse:close"));
  }
  static init(t = '[data-fw-component="collapse"]') {
    o(t).forEach((s) => new a(s));
  }
  static getInstance(t) {
    return t._fwCollapse ?? null;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  d.init(), h.init(), a.init();
});
const f = { Modal: d, Dropdown: h, Collapse: a };
window.CassetteCSS = f;
export {
  a as Collapse,
  h as Dropdown,
  d as Modal,
  f as default
};
