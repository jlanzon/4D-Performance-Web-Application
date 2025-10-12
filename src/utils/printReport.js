// Prints the selected element by cloning it into a hidden iframe (A4, light).
// Converts any <canvas> charts inside the selection to <img> for reliable output.
export async function printReport(selector, filename = "4D-Leadership-Score.pdf") {
  const src = document.querySelector(selector);
  if (!src) {
    console.error(`printReport: no element found for selector "${selector}"`);
    return;
  }

  const clone = src.cloneNode(true);

  // Convert canvases (e.g., Chart.js) to images so they render in the print frame
  const srcCanvases = src.querySelectorAll("canvas");
  const cloneCanvases = clone.querySelectorAll("canvas");
  srcCanvases.forEach((canvas, i) => {
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const img = document.createElement("img");
      img.src = dataUrl;
      img.style.maxWidth = "100%";
      img.style.height = "auto";
      // keep rough physical size
      img.width = canvas.width / (window.devicePixelRatio || 1);
      img.height = canvas.height / (window.devicePixelRatio || 1);
      const target = cloneCanvases[i];
      if (target && target.parentNode) target.parentNode.replaceChild(img, target);
    } catch (e) {
      console.warn("printReport: unable to convert canvas to image", e);
    }
  });

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${filename}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page { size: A4; margin: 12mm; }
    html, body { background: #fff !important; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

    /* Avoid splitting these across pages */
    .avoid-break, h1, h2, h3, h4, h5, h6, li, section, article,
    .rounded-xl, .rounded-2xl, .prose, .card { break-inside: avoid-page; page-break-inside: avoid; }

    /* Optional helper */
    .page-break { page-break-before: always; break-before: page; }

    /* Remove sticky/pos fixed behaviors that confuse printers */
    * { position: static !important; }

    /* Keep images/charts scaling to page width */
    img { max-width: 100%; height: auto; }

    /* No heavy shadows in print */
    .shadow, .shadow-md, .shadow-lg, .shadow-xl { box-shadow: none !important; }
  </style>
</head>
<body>
  ${clone.outerHTML}
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.left = "-10000px";
  iframe.style.top = "0";
  iframe.style.width = "794px";
  iframe.style.height = "1123px";
  iframe.src = url;
  document.body.appendChild(iframe);

  await new Promise((resolve) => {
    iframe.onload = () => setTimeout(resolve, 250);
  });

  try { iframe.contentDocument.title = filename; } catch (_) {}

  iframe.contentWindow.focus();
  iframe.contentWindow.print();

  setTimeout(() => {
    document.body.removeChild(iframe);
    URL.revokeObjectURL(url);
  }, 1000);
}
