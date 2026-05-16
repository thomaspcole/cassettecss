import { $$, on } from '../util.js'

export class Accordion {
  constructor(element, options = {}) {
    this.el = element
    this.btn = element.querySelector('.accordion-btn')
    this.body = element.querySelector('.accordion-body')
    this.chevron = element.querySelector('.accordion-chevron')
    this._isOpen = element.dataset.fwOpen === 'true'
    this._init()
    element._fwAccordion = this
  }

  _init() {
    if (!this.btn || !this.body) return
    if (!this._isOpen) {
      this.body.style.display = 'none'
    } else {
      this.btn.classList.add('is-open')
      this.chevron?.classList.add('is-open')
    }
    on(this.btn, 'click', () => this.toggle())
  }

  toggle() {
    this._isOpen ? this.close() : this.open()
  }

  open() {
    this.body.style.display = 'block'
    this._isOpen = true
    this.btn.classList.add('is-open')
    this.chevron?.classList.add('is-open')
    const group = this.el.closest('[data-fw-accordion]')
    if (group) {
      $$('[data-fw-component="accordion"]', group).forEach(item => {
        if (item !== this.el && item._fwAccordion) item._fwAccordion.close()
      })
    }
    this.el.dispatchEvent(new CustomEvent('fw:accordion:open'))
  }

  close() {
    this.body.style.display = 'none'
    this._isOpen = false
    this.btn.classList.remove('is-open')
    this.chevron?.classList.remove('is-open')
    this.el.dispatchEvent(new CustomEvent('fw:accordion:close'))
  }

  static init(selector = '[data-fw-component="accordion"]') {
    $$(selector).forEach(el => new Accordion(el))
  }

  static getInstance(el) {
    return el._fwAccordion ?? null
  }
}
