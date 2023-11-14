export function isIOS() {
  return /iPhone|iPad|iPod/i.test(
    navigator.userAgent || navigator.vendor || (window.opera && window.opera.toString() === `[object Opera]`),
  )
}
