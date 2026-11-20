(() => {
  "use strict";

  const button = document.getElementById("buildOffline");
  if (!button) return;

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.hidden = true;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function downloadGeneratedArtifact() {
    const response = await fetch(new URL("offline/AlfaCode-Offline.html", document.baseURI), { cache: "no-store" });
    if (!response.ok) throw new Error("Offline artifact is not available (HTTP " + response.status + ").");
    downloadBlob(await response.blob(), "AlfaCode-Offline.html");
  }

  function snapshotStandaloneDocument() {
    const clone = document.documentElement.cloneNode(true);
    clone.querySelectorAll("script[src], link[rel='stylesheet'][href], iframe[src]").forEach(element => element.remove());
    const html = "<!doctype html>\n" + clone.outerHTML;
    downloadBlob(new Blob([html], { type: "text/html;charset=utf-8" }), "AlfaCode-Offline.html");
  }

  button.addEventListener("click", async () => {
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = "Preparing offline file...";
    try {
      if (window.__ALFACODE_OFFLINE_BUILD__ || location.protocol === "file:" || document.querySelector("iframe[srcdoc]")) {
        snapshotStandaloneDocument();
      } else {
        await downloadGeneratedArtifact();
      }
      button.textContent = "Offline file ready";
      window.setTimeout(() => { button.textContent = originalText; }, 2500);
    } catch (error) {
      console.error("Offline file action failed:", error);
      button.textContent = "Offline build unavailable";
      window.alert(error.message || "Unable to prepare the offline file.");
      window.setTimeout(() => { button.textContent = originalText; }, 2500);
    } finally {
      button.disabled = false;
    }
  });
})();
