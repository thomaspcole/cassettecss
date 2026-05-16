export function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector))
}

export function $(selector, context = document) {
  return context.querySelector(selector)
}

export function on(el, event, handler, options) {
  el.addEventListener(event, handler, options)
}

export function off(el, event, handler) {
  el.removeEventListener(event, handler)
}
