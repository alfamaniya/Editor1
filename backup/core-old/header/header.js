// #header.js: مدیریت رفتار و دکمه‌های سربرگ
class AppHeader extends HTMLElement {
  async connectedCallback() {
    if (this.querySelector(".header-bar")) return;
    const base = new URL("./", import.meta.url);
    const markup = await fetch(new URL("header.html", base)).then(response => {
      if (!response.ok) throw new Error("Unable to load header markup.");
      return response.text();
    });
    const template = document.createElement("template");
    template.innerHTML = markup;
    this.append(template.content.cloneNode(true));
    const actions = this.querySelector(".header-actions");
    for (const child of [...this.children]) {
      if (child.matches('[slot="header-actions"]')) {
        child.removeAttribute("slot");
        actions?.append(child);
      }
    }
  }
}
if (!customElements.get("app-header")) customElements.define("app-header", AppHeader);
