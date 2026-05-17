import { on, off } from '../util.js'

export class CustomSelect {
  constructor(selectEl) {
    this.select = selectEl
    this._isOpen = false
    this._focusedIndex = -1
    this._items = []
    this._build()
    this._bindEvents()
    selectEl._fwCustomSelect = this
  }

  // ── DOM construction ──────────────────────────────────────────

  _build() {
    const sel = this.select

    this.wrapper = document.createElement('div')
    this.wrapper.className = 'custom-select'

    this.trigger = document.createElement('button')
    this.trigger.type = 'button'
    this.trigger.className = 'custom-select-trigger'
    this.trigger.setAttribute('aria-haspopup', 'listbox')
    this.trigger.setAttribute('aria-expanded', 'false')
    if (sel.disabled) {
      this.trigger.disabled = true
      this.wrapper.classList.add('is-disabled')
    }

    this._label = document.createElement('span')
    this.arrow = document.createElement('span')
    this.arrow.className = 'custom-select-arrow'
    this.trigger.append(this._label, this.arrow)

    this.list = document.createElement('ul')
    this.list.className = 'custom-select-list'
    this.list.setAttribute('role', 'listbox')

    this._buildOptions()

    this.wrapper.append(this.trigger, this.list)
    sel.parentNode.insertBefore(this.wrapper, sel.nextSibling)
    sel.hidden = true

    this._syncLabel()
  }

  _buildOptions() {
    this.list.innerHTML = ''
    this._items = []

    Array.from(this.select.options).forEach((opt) => {
      const li = document.createElement('li')
      li.className = 'custom-select-option'
      li.setAttribute('role', 'option')
      li.dataset.value = opt.value
      li.textContent = opt.text
      if (opt.disabled) li.classList.add('is-disabled')
      if (opt.selected) li.classList.add('is-selected')
      this.list.appendChild(li)
      this._items.push(li)
    })
  }

  _syncLabel() {
    const sel = this.select
    const opt = sel.options[sel.selectedIndex]
    this._label.textContent = opt ? opt.text : ''
  }

  // ── Events ────────────────────────────────────────────────────

  _bindEvents() {
    on(this.trigger, 'click', (e) => {
      e.stopPropagation()
      this._isOpen ? this.close() : this.open()
    })

    on(this.list, 'click', (e) => {
      const opt = e.target.closest('.custom-select-option')
      if (!opt || opt.classList.contains('is-disabled')) return
      this._pick(opt)
      this.close()
    })

    on(this.trigger, 'keydown', (e) => this._onKey(e))
    on(this.list,    'keydown', (e) => this._onKey(e))

    this._onOutside = (e) => {
      if (!this.wrapper.contains(e.target)) this.close()
    }
  }

  _onKey(e) {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (!this._isOpen) { this.open(); return }
        if (this._focusedIndex >= 0) {
          this._pick(this._items[this._focusedIndex])
          this.close()
          this.trigger.focus()
        }
        break
      case 'Escape':
        e.preventDefault()
        this.close()
        this.trigger.focus()
        break
      case 'ArrowDown':
        e.preventDefault()
        this._isOpen ? this._moveFocus(1) : this.open()
        break
      case 'ArrowUp':
        e.preventDefault()
        this._isOpen ? this._moveFocus(-1) : this.open()
        break
      case 'Home':
        e.preventDefault()
        this._setFocus(0)
        break
      case 'End':
        e.preventDefault()
        this._setFocus(this._items.length - 1)
        break
      default:
        // Type-ahead: jump to first option starting with the pressed key
        if (e.key.length === 1) {
          const ch = e.key.toLowerCase()
          const match = this._items.findIndex(
            (li, i) => i > this._focusedIndex && !li.classList.contains('is-disabled') &&
                       li.textContent.trim().toLowerCase().startsWith(ch)
          ) ?? this._items.findIndex(
            li => !li.classList.contains('is-disabled') &&
                  li.textContent.trim().toLowerCase().startsWith(ch)
          )
          if (match >= 0) this._setFocus(match)
        }
    }
  }

  _moveFocus(dir) {
    let i = this._focusedIndex + dir
    while (i >= 0 && i < this._items.length && this._items[i].classList.contains('is-disabled')) {
      i += dir
    }
    if (i >= 0 && i < this._items.length) this._setFocus(i)
  }

  _setFocus(index) {
    this._items.forEach(li => li.classList.remove('is-focused'))
    if (index < 0 || index >= this._items.length) return
    this._focusedIndex = index
    this._items[index].classList.add('is-focused')
    this._items[index].scrollIntoView({ block: 'nearest' })
  }

  _pick(optionEl) {
    this.select.value = optionEl.dataset.value
    this._items.forEach(li => li.classList.remove('is-selected'))
    optionEl.classList.add('is-selected')
    this._syncLabel()
    this.select.dispatchEvent(new Event('change', { bubbles: true }))
    this.wrapper.dispatchEvent(new CustomEvent('fw:select:change', {
      bubbles: true,
      detail: { value: optionEl.dataset.value, text: optionEl.textContent.trim() }
    }))
  }

  // ── Public API ────────────────────────────────────────────────

  open() {
    if (this._isOpen || this.trigger.disabled) return
    this._isOpen = true
    this.wrapper.classList.add('open')
    this.trigger.setAttribute('aria-expanded', 'true')
    // Focus the selected option, or the first
    const sel = this._items.findIndex(li => li.classList.contains('is-selected'))
    this._setFocus(sel >= 0 ? sel : 0)
    on(document, 'click', this._onOutside)
    this.wrapper.dispatchEvent(new CustomEvent('fw:select:open', { bubbles: true }))
  }

  close() {
    if (!this._isOpen) return
    this._isOpen = false
    this.wrapper.classList.remove('open')
    this.trigger.setAttribute('aria-expanded', 'false')
    this._items.forEach(li => li.classList.remove('is-focused'))
    this._focusedIndex = -1
    off(document, 'click', this._onOutside)
    this.wrapper.dispatchEvent(new CustomEvent('fw:select:close', { bubbles: true }))
  }

  getValue() { return this.select.value }

  setValue(value) {
    const opt = this._items.find(li => li.dataset.value === String(value))
    if (opt && !opt.classList.contains('is-disabled')) this._pick(opt)
  }

  destroy() {
    this.close()
    this.wrapper.remove()
    this.select.hidden = false
    delete this.select._fwCustomSelect
  }

  static init(selector = 'select[data-fw-component="custom-select"]') {
    document.querySelectorAll(selector).forEach(el => new CustomSelect(el))
  }

  static getInstance(el) {
    return el._fwCustomSelect ?? null
  }
}
