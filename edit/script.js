const API_URL = "https://51.12.220.246:4000";

// Load all images when the button is clicked
document.getElementById("loadImages").addEventListener("click", loadAllImages);

async function loadAllImages() {
  const container = document.getElementById("imageList");
  container.innerHTML = ""; // Clear current content

  try {
    const res = await fetch(`${API_URL}/ListImages`);
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    const data = await res.json();
    const images = data.images;

    if (images.length === 0) {
      container.innerHTML = "<p>No images found.</p>";
      return;
    }

    for (const filename of images) {
      const imageUrl = `${API_URL}/images/${filename}`;
      const card = document.createElement("div");
      card.className = "image-card";

      const img = document.createElement("img");
      img.src = imageUrl;

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.onclick = async () => {
        const confirmed = confirm(`Remove image "${filename}"?`);
        if (confirmed) {
          await removeImage(filename);
          loadAllImages(); // Refresh the list
        }
      };

      card.appendChild(img);
      card.appendChild(removeBtn);
      container.appendChild(card);
    }
  } catch (err) {
    console.error("Error loading images:", err);
  }
}

async function removeImage(filename) {
  try {
    const res = await fetch(`${API_URL}/DeleteImage/${filename}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }
    console.log(`Deleted: ${filename}`);
  } catch (err) {
    console.error("Failed to delete image:", err);
  }
}
