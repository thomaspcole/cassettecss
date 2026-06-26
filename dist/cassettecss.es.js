var y = Object.defineProperty;
var E = (o, t, s) => t in o ? y(o, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : o[t] = s;
var _ = (o, t, s) => E(o, typeof t != "symbol" ? t + "" : t, s);
function n(o, t = document) {
  return Array.from(t.querySelectorAll(o));
}
function i(o, t, s, e) {
  o.addEventListener(t, s, e);
}
function b(o, t, s) {
  o.removeEventListener(t, s);
}
const h = class h {
  constructor(t, s = {}) {
    this.el = t, this.options = { ...h.defaults, ...s }, this._isOpen = !1, this._escHandler = null, this._init(), t._fwModal = this;
  }
  _init() {
    const t = this.el.id;
    t && n(`[data-fw-toggle="modal"][data-fw-target="#${t}"]`).forEach((s) => {
      i(s, "click", () => this.show());
    }), n('[data-fw-dismiss="modal"]', this.el).forEach((s) => {
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
    this.el.style.display = "none", this._isOpen = !1, document.body.style.overflow = "", this.el.dispatchEvent(new CustomEvent("fw:modal:hide")), this._escHandler && (b(document, "keydown", this._escHandler), this._escHandler = null);
  }
  static init(t = '[data-fw-component="modal"]') {
    n(t).forEach((s) => new h(s));
  }
  static getInstance(t) {
    return t._fwModal ?? null;
  }
};
_(h, "defaults", { keyboard: !0 });
let l = h;
class u {
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
    this.menu.style.display = "none", this._isOpen = !1, (t = this.chevron) == null || t.classList.remove("is-open"), this.el.dispatchEvent(new CustomEvent("fw:dropdown:hide")), this._outsideHandler && (b(document, "click", this._outsideHandler), this._outsideHandler = null);
  }
  static init(t = '[data-fw-component="dropdown"]') {
    n(t).forEach((s) => new u(s));
  }
  static getInstance(t) {
    return t._fwDropdown ?? null;
  }
}
class p {
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
    })), i(this.btn, "click", () => this.toggle());
  }
  toggle() {
    this._isOpen ? this.close() : this.open();
  }
  open() {
    var s;
    this._isOpen = !0, this.el.classList.add("is-open"), this.btn.classList.add("is-open"), (s = this.chevron) == null || s.classList.add("is-open");
    const t = this.el.closest("[data-fw-accordion]");
    t && n('[data-fw-component="accordion"]', t).forEach((e) => {
      e !== this.el && e._fwAccordion && e._fwAccordion.close();
    }), this.el.dispatchEvent(new CustomEvent("fw:accordion:open"));
  }
  close() {
    var t;
    this._isOpen = !1, this.el.classList.remove("is-open"), this.btn.classList.remove("is-open"), (t = this.chevron) == null || t.classList.remove("is-open"), this.el.dispatchEvent(new CustomEvent("fw:accordion:close"));
  }
  static init(t = '[data-fw-component="accordion"]') {
    n(t).forEach((s) => new p(s));
  }
  static getInstance(t) {
    return t._fwAccordion ?? null;
  }
}
class f {
  constructor(t) {
    this.select = t, this._isOpen = !1, this._focusedIndex = -1, this._items = [], this._build(), this._bindEvents(), t._fwCustomSelect = this;
  }
  // ── DOM construction ──────────────────────────────────────────
  _build() {
    const t = this.select;
    this.wrapper = document.createElement("div"), this.wrapper.className = "custom-select", this.trigger = document.createElement("button"), this.trigger.type = "button", this.trigger.className = "custom-select-trigger", this.trigger.setAttribute("aria-haspopup", "listbox"), this.trigger.setAttribute("aria-expanded", "false"), t.disabled && (this.trigger.disabled = !0, this.wrapper.classList.add("is-disabled")), this._label = document.createElement("span"), this.arrow = document.createElement("span"), this.arrow.className = "custom-select-arrow", this.trigger.append(this._label, this.arrow), this.list = document.createElement("ul"), this.list.className = "custom-select-list", this.list.setAttribute("role", "listbox"), this._buildOptions(), this.wrapper.append(this.trigger, this.list), t.parentNode.insertBefore(this.wrapper, t.nextSibling), t.hidden = !0, this._syncLabel();
  }
  _buildOptions() {
    this.list.innerHTML = "", this._items = [], Array.from(this.select.options).forEach((t) => {
      const s = document.createElement("li");
      s.className = "custom-select-option", s.setAttribute("role", "option"), s.dataset.value = t.value, s.textContent = t.text, t.disabled && s.classList.add("is-disabled"), t.selected && s.classList.add("is-selected"), this.list.appendChild(s), this._items.push(s);
    });
  }
  _syncLabel() {
    const t = this.select, s = t.options[t.selectedIndex];
    this._label.textContent = s ? s.text : "";
  }
  // ── Events ────────────────────────────────────────────────────
  _bindEvents() {
    i(this.trigger, "click", (t) => {
      t.stopPropagation(), this._isOpen ? this.close() : this.open();
    }), i(this.list, "click", (t) => {
      const s = t.target.closest(".custom-select-option");
      !s || s.classList.contains("is-disabled") || (this._pick(s), this.close());
    }), i(this.trigger, "keydown", (t) => this._onKey(t)), i(this.list, "keydown", (t) => this._onKey(t)), this._onOutside = (t) => {
      this.wrapper.contains(t.target) || this.close();
    };
  }
  _onKey(t) {
    switch (t.key) {
      case "Enter":
      case " ":
        if (t.preventDefault(), !this._isOpen) {
          this.open();
          return;
        }
        this._focusedIndex >= 0 && (this._pick(this._items[this._focusedIndex]), this.close(), this.trigger.focus());
        break;
      case "Escape":
        t.preventDefault(), this.close(), this.trigger.focus();
        break;
      case "ArrowDown":
        t.preventDefault(), this._isOpen ? this._moveFocus(1) : this.open();
        break;
      case "ArrowUp":
        t.preventDefault(), this._isOpen ? this._moveFocus(-1) : this.open();
        break;
      case "Home":
        t.preventDefault(), this._setFocus(0);
        break;
      case "End":
        t.preventDefault(), this._setFocus(this._items.length - 1);
        break;
      default:
        if (t.key.length === 1) {
          const s = t.key.toLowerCase(), e = this._items.findIndex(
            (a, c) => c > this._focusedIndex && !a.classList.contains("is-disabled") && a.textContent.trim().toLowerCase().startsWith(s)
          ) ?? this._items.findIndex(
            (a) => !a.classList.contains("is-disabled") && a.textContent.trim().toLowerCase().startsWith(s)
          );
          e >= 0 && this._setFocus(e);
        }
    }
  }
  _moveFocus(t) {
    let s = this._focusedIndex + t;
    for (; s >= 0 && s < this._items.length && this._items[s].classList.contains("is-disabled"); )
      s += t;
    s >= 0 && s < this._items.length && this._setFocus(s);
  }
  _setFocus(t) {
    this._items.forEach((s) => s.classList.remove("is-focused")), !(t < 0 || t >= this._items.length) && (this._focusedIndex = t, this._items[t].classList.add("is-focused"), this._items[t].scrollIntoView({ block: "nearest" }));
  }
  _pick(t) {
    this.select.value = t.dataset.value, this._items.forEach((s) => s.classList.remove("is-selected")), t.classList.add("is-selected"), this._syncLabel(), this.select.dispatchEvent(new Event("change", { bubbles: !0 })), this.wrapper.dispatchEvent(new CustomEvent("fw:select:change", {
      bubbles: !0,
      detail: { value: t.dataset.value, text: t.textContent.trim() }
    }));
  }
  // ── Public API ────────────────────────────────────────────────
  open() {
    if (this._isOpen || this.trigger.disabled) return;
    this._isOpen = !0, this.wrapper.classList.add("open"), this.trigger.setAttribute("aria-expanded", "true");
    const t = this._items.findIndex((s) => s.classList.contains("is-selected"));
    this._setFocus(t >= 0 ? t : 0), i(document, "click", this._onOutside), this.wrapper.dispatchEvent(new CustomEvent("fw:select:open", { bubbles: !0 }));
  }
  close() {
    this._isOpen && (this._isOpen = !1, this.wrapper.classList.remove("open"), this.trigger.setAttribute("aria-expanded", "false"), this._items.forEach((t) => t.classList.remove("is-focused")), this._focusedIndex = -1, b(document, "click", this._onOutside), this.wrapper.dispatchEvent(new CustomEvent("fw:select:close", { bubbles: !0 })));
  }
  getValue() {
    return this.select.value;
  }
  setValue(t) {
    const s = this._items.find((e) => e.dataset.value === String(t));
    s && !s.classList.contains("is-disabled") && this._pick(s);
  }
  destroy() {
    this.close(), this.wrapper.remove(), this.select.hidden = !1, delete this.select._fwCustomSelect;
  }
  static init(t = 'select[data-fw-component="custom-select"]') {
    document.querySelectorAll(t).forEach((s) => new f(s));
  }
  static getInstance(t) {
    return t._fwCustomSelect ?? null;
  }
}
class w {
  constructor(t) {
    this.el = t, this._init(), t._fwTabs = this;
  }
  _init() {
    n(".tab-link", this.el).forEach((t) => {
      i(t, "click", (s) => {
        s.preventDefault();
        const e = t.dataset.fwTarget;
        e && this.show(e);
      });
    });
  }
  show(t) {
    var a, c, v;
    const s = this.el.dataset.fwContent, e = s ? document.querySelector(s) : this.el.nextElementSibling;
    e && (n("[data-fw-target]", this.el).forEach((m) => {
      var g;
      (g = m.closest(".tab-item")) == null || g.classList.remove("is-active");
    }), (c = (a = this.el.querySelector(`[data-fw-target="${t}"]`)) == null ? void 0 : a.closest(".tab-item")) == null || c.classList.add("is-active"), n(".tab-panel", e).forEach((m) => m.classList.remove("is-active")), (v = e.querySelector(t)) == null || v.classList.add("is-active"), this.el.dispatchEvent(new CustomEvent("fw:tabs:show", { detail: { targetId: t } })));
  }
  static init(t = '[data-fw-component="tabs"]') {
    n(t).forEach((s) => new w(s));
  }
  static getInstance(t) {
    return t._fwTabs ?? null;
  }
}
const r = class r {
  constructor(t, s = {}) {
    this.el = t, this.options = { ...r.defaults, ...s }, this._timer = null, this._init(), t._fwToast = this;
  }
  _init() {
    const t = this.el.querySelector('[data-fw-dismiss="toast"]');
    t && i(t, "click", () => this.hide());
  }
  show() {
    this.el.style.display = "flex", this.el.dispatchEvent(new CustomEvent("fw:toast:show")), this.options.duration > 0 && (this._timer = setTimeout(() => this.hide(), this.options.duration));
  }
  hide() {
    this.el.style.display = "none", this.el.dispatchEvent(new CustomEvent("fw:toast:hide")), clearTimeout(this._timer), this._timer = null;
  }
  static init(t = '[data-fw-component="toast"]') {
    n(t).forEach((s) => {
      const e = new r(s, {
        duration: s.dataset.fwDuration ? Number(s.dataset.fwDuration) : 4e3
      }), a = s.id;
      a && n(`[data-fw-toggle="toast"][data-fw-target="#${a}"]`).forEach((c) => {
        i(c, "click", () => e.show());
      });
    });
  }
  static getInstance(t) {
    return t._fwToast ?? null;
  }
};
_(r, "defaults", { duration: 4e3 });
let d = r;
document.addEventListener("DOMContentLoaded", () => {
  l.init(), u.init(), p.init(), f.init(), w.init(), d.init();
});
const L = { Modal: l, Dropdown: u, Accordion: p, CustomSelect: f, Tabs: w, Toast: d };
window.CassetteCSS = L;
export {
  p as Accordion,
  f as CustomSelect,
  u as Dropdown,
  l as Modal,
  w as Tabs,
  d as Toast,
  L as default
};
