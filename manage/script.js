const API_URL = "https://51.12.220.246:4000";

document.getElementById("loadImages").addEventListener("click", () => {
  loadAllImages(false);
});
document.getElementById("loadRemoved").addEventListener("click", loadRemoved);
document.getElementById("funButton").addEventListener("click", Fun);

async function loadAllImages(removed) {
  const container = removed
    ? document.getElementById("removedList")
    : document.getElementById("imageList");
  container.innerHTML = "";

  try {
    const res = await fetch(
      `${API_URL}/GetAllImages?removed=${removed ? "true" : "false"}`
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    const images = await res.json();

    if (images.length === 0) {
      container.innerHTML = "<p>No images found.</p>";
      return;
    }

    for (const image of images) {
      const filename = typeof image === "string" ? image : image.filename;
      const imageUrl = `${API_URL}/${
        removed ? "removed_images" : "images"
      }/${filename}`;

      const card = document.createElement("div");
      card.className = "image-card";

      const img = document.createElement("img");
      img.src = imageUrl;

      const sendNextBtn = document.createElement("button");
      sendNextBtn.textContent = "Send Next";
      sendNextBtn.onclick = async () => {
        await sendNext(filename);
      };

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.onclick = async () => {
        const confirmed = confirm(`Remove image "${filename}"?`);
        if (confirmed) {
          await removeImage(filename, removed);
          loadAllImages(removed);
        }
      };

      card.appendChild(img);
      card.appendChild(sendNextBtn);
      card.appendChild(removeBtn);
      container.appendChild(card);
    }
  } catch (err) {
    console.error("Error loading images:", err);
  }
}

async function removeImage(filename, removed) {
  try {
    const res = await fetch(
      `${API_URL}/RemoveImage/${filename}?remove=true&fromRemoved=${removed}`,
      {
        method: "DELETE",
      }
    );
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }
    console.log(`Deleted: ${filename}`);
  } catch (err) {
    console.error("Failed to delete image:", err);
  }
}

async function sendNext(filename) {
  try {
    const res = await fetch(`${API_URL}/SendNext`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filename }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    console.log(`Next image set: ${filename}`);
  } catch (err) {
    console.error("Failed to set next image:", err);
  }
}

async function loadRemoved() {
  await loadAllImages(true);
}

async function GetSendNextQueue() {
  try {
    const res = await fetch(`${API_URL}/GetSendNextQueue`, {
      method: "GET",
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    const queue = await res.json();
    console.log("Current Send Next Queue:", queue);
  } catch (err) {
    console.error("Failed to get the queue:", err);
  }
}

async function Fun() {
  try {
    const res = await fetch(`${API_URL}/Fun`, {
      method: "Post",
    });
  } catch (err) {
    console.error("Fun failed:", err);
  }
}
