const API_URL = "https://51.12.220.246:4000";

// Event listeners
document
  .getElementById("loadImages")
  .addEventListener("click", () => loadAllImages(false));
document
  .getElementById("qlearQueue")
  .addEventListener("click", () => clearQueue());

document.getElementById("loadLoop").addEventListener("click", () => loadLoop());

document
  .getElementById("clearLoop")
  .addEventListener("click", () => clearLoop());

async function loadAllImages(removed = false) {
  const container = document.getElementById("imageList");
  container.innerHTML = ""; // Clear current content

  try {
    const res = await fetch(`${API_URL}/GetAllImages?removed=${removed}`, {
      method: "GET",
    });

    if (!res.ok) throw new Error(await res.text());

    const images = await res.json();

    if (images.length === 0) {
      container.innerHTML = "<p>No images found.</p>";
      return;
    }

    images.forEach((image) => {
      const filename = typeof image === "string" ? image : image.filename;
      const imageUrl = `${API_URL}/images/${filename}`;

      const card = document.createElement("div");
      card.className = "image-card";

      const img = document.createElement("img");
      img.src = imageUrl;

      const buttons = createButtons(filename, removed);
      card.appendChild(img);
      card.appendChild(buttons);
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading images:", err);
  }
}

function createButtons(filename, removed) {
  const buttons = document.createElement("div");
  buttons.className = "cardButtons";

  // Send Next button
  const sendNextBtn = createButton("Send Next", async () => {
    await sendNext(filename);
  });

  // Add to Loop button
  const addLoopBtn = createButton("Add to Loop", async () => {
    await addToLoopQueue(filename);
    await loadLoop(); // Refresh loop view
  });

  // Remove button
  const removeBtn = createButton("Remove", async () => {
    const confirmed = confirm(`Remove image "${filename}"?`);
    if (confirmed) {
      await removeImage(filename);
      loadAllImages(removed); // Refresh list after removal
    }
  });

  // Append buttons
  buttons.appendChild(sendNextBtn);
  buttons.appendChild(addLoopBtn);
  buttons.appendChild(removeBtn);

  return buttons;
}

function createButton(text, onClick) {
  const button = document.createElement("button");
  button.textContent = text;
  button.onclick = onClick;
  return button;
}

async function removeImage(filename) {
  try {
    const res = await fetch(
      `${API_URL}/RemoveImage/${filename}?remove=false&fromRemoved=false`,
      {
        method: "DELETE",
      }
    );
    if (!res.ok) throw new Error(await res.text());
    console.log(`Deleted: ${filename}`);
  } catch (err) {
    console.error("Failed to delete image:", err);
  }
}

async function addToLoopQueue(filename) {
  try {
    const res = await fetch(`${API_URL}/AddLoop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filename }),
    });
    console.log(`Added to loop: ${filename}`);
  } catch (err) {
    console.error("Failed to add image to loop:", err);
  }
}

async function loadLoop() {
  const container = document.getElementById("loopList");
  container.innerHTML = ""; // Clear current content

  try {
    const res = await fetch(`${API_URL}/GetLoop`);
    if (!res.ok) throw new Error(await res.text());

    const images = await res.json();

    if (images.length === 0) {
      container.innerHTML = "<p>No images found.</p>";
      return;
    }

    images.forEach((image) => {
      const filename = typeof image === "string" ? image : image.filename;
      const imageUrl = `${API_URL}/images/${filename}`;

      const card = document.createElement("div");
      card.className = "image-card";

      const img = document.createElement("img");
      img.src = imageUrl;
      const removeBtn = createButton(
        "Remove from Loop",
        async () => await removeFromLoop(filename)
      );

      card.appendChild(img);
      card.appendChild(removeBtn);
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading images:", err);
  }
}

async function removeFromLoop(filename) {
  try {
    const res = await fetch(`${API_URL}/RemoveFromLoop`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename }), // Corrected: send body, not URL param
    });

    if (!res.ok) throw new Error(await res.text());

    console.log(`Removed from loop queue: ${filename}`);
    await loadLoop(); // Refresh UI after removing
  } catch (err) {
    console.error("Failed to remove image from loop:", err);
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

    if (!res.ok) throw new Error(await res.text());
    console.log(`Next image set: ${filename}`);
  } catch (err) {
    console.error("Failed to set next image:", err);
  }
}

async function clearQueue() {
  try {
    const res = await fetch(`${API_URL}/ClearSendNextQueue`, {
      method: "POST",
    });
    if (!res.ok) throw new Error(await res.text());

    console.log(`Queue Cleared`);
  } catch (err) {
    console.error("Failed to clear the queue:", err);
  }
}

async function clearLoop() {
  try {
    const res = await fetch(`${API_URL}/ClearLoop`, {
      method: "POST",
    });
    if (!res.ok) throw new Error(await res.text());
    const container = document.getElementById("loopList");
    container.innerHTML = "<p>No images found.</p>";
    console.log(`Loop Cleared`);
  } catch (err) {
    console.error("Failed to clear the Loop:", err);
  }
}

async function GetSendNextQueue() {
  try {
    const res = await fetch(`${API_URL}/GetSendNextQueue`, {
      method: "GET",
    });

    if (!res.ok) throw new Error(await res.text());

    const queue = await res.json();
    console.log("Current Send Next Queue:", queue);
  } catch (err) {
    console.error("Failed to get the queue:", err);
  }
}
