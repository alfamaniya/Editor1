/**
 * Small UI adapter for the HTML completion engine.
 * It knows nothing about HTML parsing, ranking, or document transactions.
 */
export async function createTagSuggestions(options = {}) {
  const ownerDocument = options.ownerDocument ?? document;
  const onSelect = typeof options.onSelect === "function" ? options.onSelect : () => {};
  let markup = options.templateMarkup ?? globalThis.__ALFACODE_TAG_SUGGESTIONS_TEMPLATE__;

  if (typeof markup !== "string" || !markup.trim()) {
    try {
      const response = await fetch("../tag-suggestions/tag-suggestions.html");
      if (!response.ok) throw new Error("Unable to load tag suggestion template.");
      markup = await response.text();
    } catch {
      return null;
    }
  }

  const template = ownerDocument.createElement("template");
  template.innerHTML = markup.trim();
  const root = template.content.firstElementChild;
  if (!root) return null;

  const list = root.querySelector(".tag-suggestions-options");
  const heading = root.querySelector(".tag-suggestions-heading");
  if (heading && options.heading) heading.textContent = options.heading;
  ownerDocument.body.appendChild(root);
  let currentOptions = [];
  let activeIndex = 0;

  function setActive(index) {
    if (!currentOptions.length) return;
    activeIndex = (index + currentOptions.length) % currentOptions.length;
    const buttons = [...list.querySelectorAll("button")];
    buttons.forEach((button, buttonIndex) => {
      const active = buttonIndex === activeIndex;
      button.classList.toggle("is-selected", active);
      button.setAttribute("aria-selected", String(active));
    });
    buttons[activeIndex]?.scrollIntoView({ block: "nearest" });
  }

  function hide() {
    root.hidden = true;
    currentOptions = [];
    activeIndex = 0;
  }

  function show(result, anchor, selected = 0) {
    currentOptions = result.options.slice(0, 10);
    activeIndex = 0;
    list.replaceChildren();

    currentOptions.forEach((option, index) => {
      const button = ownerDocument.createElement("button");
      button.type = "button";
      button.className = "tag-suggestion-option";
      button.setAttribute("role", "option");
      button.setAttribute("aria-selected", "false");
      const label = ownerDocument.createElement("span");
      label.className = "tag-suggestion-label";
      label.textContent = option.displayLabel ?? option.insertText ?? (option.kind === "open" || option.kind === "child" ? "<" + option.label + ">" : option.label);
      const description = ownerDocument.createElement("span");
      description.className = "tag-suggestion-description";
      description.textContent = option.description ?? "";
      button.append(label, description);
      button.addEventListener("mousedown", event => event.preventDefault());
      button.addEventListener("click", () => onSelect(option));
      list.appendChild(button);
      if (index === selected) activeIndex = index;
    });

    const bounds = anchor ?? { left: 8, bottom: 8 };
    const width = Math.min(280, Math.max(180, ownerDocument.defaultView.innerWidth - 16));
    const left = Math.max(8, Math.min(bounds.left, ownerDocument.defaultView.innerWidth - width - 8));
    const estimatedHeight = Math.min(360, 54 + currentOptions.length * 34);
    const below = bounds.bottom + estimatedHeight < ownerDocument.defaultView.innerHeight;
    const top = below
      ? bounds.bottom + 6
      : Math.max(8, (bounds.top ?? bounds.bottom) - estimatedHeight - 6);
    root.style.left = left + "px";
    root.style.top = top + "px";
    root.hidden = currentOptions.length === 0;
    setActive(activeIndex);
  }

  return {
    show,
    hide,
    setActive,
    get isOpen() { return !root.hidden; },
    get activeIndex() { return activeIndex; },
    get selectedOption() { return currentOptions[activeIndex] ?? null; },
    destroy() { root.remove(); }
  };
}
