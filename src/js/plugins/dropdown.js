import { $$, on, off } from '../util.js'

export class Dropdown {
  constructor(element, options = {}) {
    this.el = element
    this.toggle = element.querySelector('.dropdown-toggle')
    this.menu = element.querySelector('.dropdown-menu')
    this.chevron = element.querySelector('.dropdown-chevron')
    this._isOpen = false
    this._outsideHandler = null
    this._init()
    element._fwDropdown = this
  }

  _init() {
    if (!this.toggle || !this.menu) return
    on(this.toggle, 'click', () => {
      this._isOpen ? this.hide() : this.show()
    })
    // Close when a menu item is selected
    on(this.menu, 'click', (e) => {
      if (e.target.closest('.dropdown-item') && !e.target.closest('.dropdown-item.is-disabled')) {
        this.hide()
      }
    })
  }

  show() {
    this.menu.style.display = 'block'
    this._isOpen = true
    this.chevron?.classList.add('is-open')
    this.el.dispatchEvent(new CustomEvent('fw:dropdown:show'))
    // Defer so this open-click doesn't immediately re-trigger the outside handler
    this._outsideHandler = (e) => {
      if (!this.el.contains(e.target)) this.hide()
    }
    requestAnimationFrame(() => {
      on(document, 'click', this._outsideHandler, { capture: true })
    })
  }

  hide() {
    this.menu.style.display = 'none'
    this._isOpen = false
    this.chevron?.classList.remove('is-open')
    this.el.dispatchEvent(new CustomEvent('fw:dropdown:hide'))
    if (this._outsideHandler) {
      off(document, 'click', this._outsideHandler)
      this._outsideHandler = null
    }
  }

  static init(selector = '[data-fw-component="dropdown"]') {
    $$(selector).forEach(el => new Dropdown(el))
  }

  static getInstance(el) {
    return el._fwDropdown ?? null
  }
}
