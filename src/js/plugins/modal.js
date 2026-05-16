import { $$, on, off } from '../util.js'

export class Modal {
  static defaults = { keyboard: true }

  constructor(element, options = {}) {
    this.el = element
    this.options = { ...Modal.defaults, ...options }
    this._isOpen = false
    this._escHandler = null
    this._init()
    element._fwModal = this
  }

  _init() {
    const id = this.el.id
    if (id) {
      $$(`[data-fw-toggle="modal"][data-fw-target="#${id}"]`).forEach(trigger => {
        on(trigger, 'click', () => this.show())
      })
    }
    $$('[data-fw-dismiss="modal"]', this.el).forEach(btn => {
      on(btn, 'click', () => this.hide())
    })
    on(this.el, 'click', (e) => {
      if (e.target === this.el) this.hide()
    })
  }

  show() {
    this.el.style.display = 'flex'
    this._isOpen = true
    document.body.style.overflow = 'hidden'
    this.el.dispatchEvent(new CustomEvent('fw:modal:show'))
    if (this.options.keyboard) {
      this._escHandler = (e) => { if (e.key === 'Escape') this.hide() }
      on(document, 'keydown', this._escHandler)
    }
  }

  hide() {
    this.el.style.display = 'none'
    this._isOpen = false
    document.body.style.overflow = ''
    this.el.dispatchEvent(new CustomEvent('fw:modal:hide'))
    if (this._escHandler) {
      off(document, 'keydown', this._escHandler)
      this._escHandler = null
    }
  }

  static init(selector = '[data-fw-component="modal"]') {
    $$(selector).forEach(el => new Modal(el))
  }

  static getInstance(el) {
    return el._fwModal ?? null
  }
}
