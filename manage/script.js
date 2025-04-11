const API_URL = "https://51.12.220.246:4000";

document
  .getElementById("loadImages")
  .addEventListener("click", () => loadAllImages(false));
document
  .getElementById("loadRemoved")
  .addEventListener("click", () => loadAllImages(true));
document.getElementById("funButton").addEventListener("click", Fun);

async function loadAllImages(removed) {
  const container = document.getElementById(
    removed ? "removedList" : "imageList"
  );
  container.innerHTML = "";

  try {
    const res = await fetch(`${API_URL}/GetAllImages?removed=${removed}`);
    const images = await res.json();

    if (images.length === 0)
      return (container.innerHTML = "<p>No images found.</p>");

    images.forEach((filename) => createImageCard(container, filename, removed));
  } catch (err) {
    console.error("Error loading images:", err);
  }
}

function createImageCard(container, filename, removed) {
  const imageUrl = `${API_URL}/${
    removed ? "removed_images" : "images"
  }/${filename}`;
  const card = document.createElement("div");
  card.className = "image-card";

  const img = document.createElement("img");
  img.src = imageUrl;

  const sendNextBtn = createButton("Send Next", () => sendNext(filename));
  const removeBtn = createButton("Remove", () =>
    removeImage(filename, removed)
  );

  card.append(img, sendNextBtn, removeBtn);
  container.appendChild(card);
}

function createButton(text, onClick) {
  const button = document.createElement("button");
  button.textContent = text;
  button.onclick = onClick;
  return button;
}

async function removeImage(filename, removed) {
  if (confirm(`Remove image "${filename}"?`)) {
    try {
      const res = await fetch(
        `${API_URL}/RemoveImage/${filename}?remove=true&fromRemoved=${removed}`,
        { method: "DELETE" }
      );
      if (res.ok) loadAllImages(removed);
    } catch (err) {
      console.error("Failed to delete image:", err);
    }
  }
}

async function sendNext(filename) {
  try {
    const res = await fetch(`${API_URL}/SendNext`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename }),
    });
    if (res.ok) console.log(`Next image set: ${filename}`);
  } catch (err) {
    console.error("Failed to set next image:", err);
  }
}

async function Fun() {
  try {
    const res = await fetch(`${API_URL}/Fun`, { method: "POST" });
    if (!res.ok) throw new Error("Fun failed.");
  } catch (err) {
    console.error("Fun failed:", err);
  }
}
