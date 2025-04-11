const API_URL = "https://51.12.220.246:4000";

// Load all images when the button is clicked
document.getElementById("loadImages").addEventListener("click", loadAllImages);
document.getElementById("qlearQueue").addEventListener("click", loadRemoved);

async function loadAllImages() {
  const container = document.getElementById("imageList");
  container.innerHTML = ""; // Clear current content

  try {
    const res = await fetch(`${API_URL}/GetAllImages`);
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
      const imageUrl = `${API_URL}/images/${filename}`;

      const card = document.createElement("div");
      card.className = "image-card";

      const img = document.createElement("img");
      img.src = imageUrl;

      // Create Send Next button
      const sendNextBtn = document.createElement("button");
      sendNextBtn.textContent = "Send Next";
      sendNextBtn.onclick = async () => {
        await sendNext(filename);
      };

      // Create Remove button
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.onclick = async () => {
        const confirmed = confirm(`Remove image "${filename}"?`);
        if (confirmed) {
          await removeImage(filename);
          loadAllImages(); // Refresh the list
        }
      };

      // Append buttons in correct order
      card.appendChild(img);
      card.appendChild(sendNextBtn); // Append Send Next button
      card.appendChild(removeBtn); // Append Remove button
      container.appendChild(card);
    }
  } catch (err) {
    console.error("Error loading images:", err);
  }
}

async function removeImage(filename) {
  try {
    const res = await fetch(`${API_URL}/RemoveImage/${filename}?remove=false`, {
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
  try {
    const res = await fetch(`${API_URL}/ClearSendNextQueue`, {
      method: "POST",
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    console.log(`Queue Cleared`);
  } catch (err) {
    console.error("Failed to clear the queue:", err);
  }
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
