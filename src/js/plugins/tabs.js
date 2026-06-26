import { $$, on } from '../util.js'

export class Tabs {
  constructor(element) {
    this.el = element
    this._init()
    element._fwTabs = this
  }

  _init() {
    $$('.tab-link', this.el).forEach(link => {
      on(link, 'click', (e) => {
        e.preventDefault()
        const target = link.dataset.fwTarget
        if (target) this.show(target)
      })
    })
  }

  show(targetId) {
    const contentId = this.el.dataset.fwContent
    const contentEl = contentId
      ? document.querySelector(contentId)
      : this.el.nextElementSibling

    if (!contentEl) return

    $$('[data-fw-target]', this.el).forEach(link => {
      link.closest('.tab-item')?.classList.remove('is-active')
    })
    this.el.querySelector(`[data-fw-target="${targetId}"]`)
      ?.closest('.tab-item')?.classList.add('is-active')

    $$('.tab-panel', contentEl).forEach(panel => panel.classList.remove('is-active'))
    contentEl.querySelector(targetId)?.classList.add('is-active')

    this.el.dispatchEvent(new CustomEvent('fw:tabs:show', { detail: { targetId } }))
  }

  static init(selector = '[data-fw-component="tabs"]') {
    $$(selector).forEach(el => new Tabs(el))
  }

  static getInstance(el) {
    return el._fwTabs ?? null
  }
}
