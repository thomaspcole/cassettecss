import { $$, on } from '../util.js'

export class Toast {
  static defaults = { duration: 4000 }

  constructor(element, options = {}) {
    this.el = element
    this.options = { ...Toast.defaults, ...options }
    this._timer = null
    this._init()
    element._fwToast = this
  }

  _init() {
    const dismiss = this.el.querySelector('[data-fw-dismiss="toast"]')
    if (dismiss) on(dismiss, 'click', () => this.hide())
  }

  show() {
    this.el.style.display = 'flex'
    this.el.dispatchEvent(new CustomEvent('fw:toast:show'))
    if (this.options.duration > 0) {
      this._timer = setTimeout(() => this.hide(), this.options.duration)
    }
  }

  hide() {
    this.el.style.display = 'none'
    this.el.dispatchEvent(new CustomEvent('fw:toast:hide'))
    clearTimeout(this._timer)
    this._timer = null
  }

  static init(selector = '[data-fw-component="toast"]') {
    $$(selector).forEach(el => {
      const instance = new Toast(el, {
        duration: el.dataset.fwDuration ? Number(el.dataset.fwDuration) : 4000,
      })
      const id = el.id
      if (id) {
        $$(`[data-fw-toggle="toast"][data-fw-target="#${id}"]`).forEach(trigger => {
          on(trigger, 'click', () => instance.show())
        })
      }
    })
  }

  static getInstance(el) {
    return el._fwToast ?? null
  }
}
