export function downloadImage(dataUrl: string) {
  const a = document.createElement("a");

  a.setAttribute("download", "flow.png");
  a.setAttribute("href", dataUrl);
  a.click();
}
