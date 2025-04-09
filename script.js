let index = 0;
const img = document.getElementById("slideshow");

async function showNextImage() {
  try {
    const response = await fetch("https://51.12.220.246:4000/GetNextImage");

    if (response.ok) {
      const data = await response.json();
      const imageUrl = data.url;
      console.log(imageUrl);
      // Preload the image and then show it
      const preloaded = new Image();
      preloaded.src = imageUrl;
      preloaded.onload = () => {
        img.style.opacity = 0;
        setTimeout(() => {
          img.src = preloaded.src;
          img.style.opacity = 1;
        }, 500);
      };
    } else {
      console.error("Failed to get image from server:", await response.text());
    }
  } catch (err) {
    console.error("Error fetching next image:", err);
  }
}

showNextImage();

setInterval(showNextImage, 7000);

async function UploadImage(image) {
  const formData = new FormData();
  formData.append("image", image);

  try {
    const response = await fetch("https://51.12.220.246:4000/SaveImage", {
      method: "POST",
      body: formData,
    });

    // Handle the server response
    if (response.ok) {
      const data = await response.json();
      console.log("Image uploaded successfully:", data);
      return `Image uploaded successfully! Filename: ${data.filename}`;
    } else {
      const error = await response.text();
      console.error("Error uploading image:", error);
      return `Error uploading image: ${error}`;
    }
  } catch (err) {
    console.error("Network error:", err);
    return `Error uploading image: ${err.message}`;
  }
}

// Handle the file input change
document.getElementById("img").addEventListener("change", async function () {
  const fileInput = document.getElementById("img");
  const imageFile = fileInput.files[0];

  if (!imageFile) {
    alert("Please select an image to upload.");
    return;
  }

  const result = await UploadImage(imageFile);
  alert(result);
});

const inputElement = document.getElementById("img");

const proximityThreshold = 100;

let isCursorNear = false;

document.addEventListener("mousemove", (e) => {
  const inputRect = inputElement.getBoundingClientRect();
  const cursorX = e.clientX;
  const cursorY = e.clientY;

  const distance = Math.sqrt(
    Math.pow(cursorX - inputRect.left, 2) + Math.pow(cursorY - inputRect.top, 2)
  );

  if (distance < proximityThreshold) {
    if (!isCursorNear) {
      isCursorNear = true;
      inputElement.classList.add("visible");
    }
  } else {
    if (isCursorNear) {
      isCursorNear = false;
      inputElement.classList.remove("visible");
    }
  }
});
