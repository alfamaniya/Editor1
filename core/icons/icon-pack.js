// #icon-pack.js: پکیج یکپارچه SVG برای آیکون‌های داخلی و آفلاین Editor1
(() => {
  "use strict";
  const shapes = {
    select: '<path d="M5 3l14 10-6 1-3 6-5-17z"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4 4"/>',
    text: '<path d="M4 6V4h16v2M12 4v16M8 20h8"/>',
    heading: '<path d="M4 5v14M20 5v14M4 12h16"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4" cy="6" r=".8" fill="currentColor"/><circle cx="4" cy="12" r=".8" fill="currentColor"/><circle cx="4" cy="18" r=".8" fill="currentColor"/>',
    section: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/>',
    container: '<rect x="3" y="4" width="18" height="16" rx="2" stroke-dasharray="3 2"/>',
    grid: '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1.5"/><path d="m4 17 5-5 3 3 3-4 5 6"/>',
    video: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3z"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h5.5A3.5 3.5 0 0 0 21 9.5 6.5 6.5 0 0 0 14.5 3H12z"/><circle cx="7.5" cy="9" r=".8"/><circle cx="10" cy="6.5" r=".8"/><circle cx="15" cy="7.5" r=".8"/>',
    background: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 15h18M15 3v18"/>',
    border: '<rect x="4" y="4" width="16" height="16" rx="2" stroke-width="2.2"/>',
    outline: '<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="2" y="2" width="20" height="20" rx="3" stroke-dasharray="2 2"/>',
    size: '<path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4"/><path d="M4 12h16M12 4v16"/>',
    shadow: '<rect x="4" y="3" width="14" height="14" rx="2"/><rect x="7" y="7" width="14" height="14" rx="2" opacity=".45"/>',
    spacing: '<path d="M4 4v16M20 4v16M8 7h8M8 12h8M8 17h8"/><path d="m10 5-2 2 2 2m4-4 2 2-2 2m-4 3-2 2 2 2m4-4 2 2-2 2"/>',
    typography: '<path d="M4 19 10 5h4l6 14M7 13h10"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 9v12"/>',
    flex: '<rect x="3" y="5" width="6" height="14" rx="1"/><rect x="15" y="5" width="6" height="14" rx="1"/><path d="M10 12h4m-2-2 2 2-2 2"/>',
    position: '<path d="M12 3v18M3 12h18"/><rect x="7" y="7" width="10" height="10" rx="1"/>',
    effects: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18z"/>',
    transform: '<path d="M4 20 20 4M7 4h13v13"/><path d="M4 7v13h13"/>',
    transition: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    animation: '<path d="M8 3h8M8 21h8M12 3v18M5 7l14 10M5 17l14-10"/>',
    content: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    scroll: '<path d="M12 4v16M8 8l4-4 4 4M8 16l4 4 4-4"/>',
    svg: '<path d="m12 3 9 9-9 9-9-9z"/><path d="m9 12 2 2 4-4"/>',
    responsive: '<rect x="3" y="4" width="13" height="16" rx="2"/><rect x="18" y="8" width="3" height="9" rx="1"/>',
    custom: '<path d="M12 5v14M5 12h14"/>',
    presets: '<path d="m12 3 2.5 5.5L21 9l-4.5 4 1.5 6-5.5-3-5.5 3 1.5-6L4 9l6.5-.5z"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>'
  };
  const svg = (name, className = "") => {
    const body = shapes[name] || shapes.custom;
    const cls = className ? ' class="' + String(className).replace(/[^a-zA-Z0-9 _-]/g, "") + '"' : "";
    return '<svg' + cls + ' viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + body + '</svg>';
  };
  const mount = (root = document) => {
    root.querySelectorAll("[data-icon]").forEach(node => {
      const name = node.getAttribute("data-icon");
      node.innerHTML = svg(name);
      node.setAttribute("aria-hidden", "true");
    });
  };
  const sprite = () => '<svg xmlns="http:' + '/' + '/' + 'www.w3.org/2000/svg" aria-hidden="true" style="display:none">' +
    Object.entries(shapes).map(([name, body]) => '<symbol id="editor1-icon-' + name + '" viewBox="0 0 24 24">' + body + '</symbol>').join("") + '</svg>';
  const symbolUse = name => '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#editor1-icon-' + (shapes[name] ? name : "custom") + '"></use></svg>';
  window.Editor1IconPack = Object.freeze({names:Object.freeze(Object.keys(shapes)),svg,mount,sprite,symbolUse});
})();
