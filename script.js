const htmlEditor = document.getElementById("html-code");
const cssEditor = document.getElementById("css-code");
const jsEditor = document.getElementById("js-code");
const preview = document.getElementById("preview");
const runButton = document.getElementById("run-button");

function runCode() {
  const htmlCode = htmlEditor.value;
  const cssCode = cssEditor.value;
  const jsCode = jsEditor.value;

  const output = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>${cssCode}</style>
</head>
<body>
  ${htmlCode}
  <script>${jsCode.replace(/<\/script/gi, "<\\/script")}<\/script>
</body>
</html>`;

  preview.srcdoc = output;
}

runButton.addEventListener("click", runCode);

runCode();
