import {FONT_FACE_CSS} from './fontface';

// Inter inlined as base64 data URIs — no network, no async load, no delayRender (which broke
// the video renderer when called at module scope). Inject the <style> once, synchronously.
export const fontFamily = 'InterLocal, system-ui, sans-serif';

if (typeof document !== 'undefined' && !document.getElementById('inter-local-font')) {
  const style = document.createElement('style');
  style.id = 'inter-local-font';
  style.textContent = FONT_FACE_CSS;
  document.head.appendChild(style);
}
