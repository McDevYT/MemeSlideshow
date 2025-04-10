let index = 0;
const img = document.getElementById("slideshow");
let slideshowInterval;
let isPaused = false;

async function showNextImage() {
  try {
    const response = await fetch("https://51.12.220.246:4000/GetNextImage");

    if (response.ok) {
      const data = await response.json();
      const imageUrl = data.url;
      console.log(imageUrl);

      if (data.fun) {
        flashImage("images/shrek.png");
      }

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

function startSlideshow() {
  slideshowInterval = setInterval(showNextImage, 7000);
}

function stopSlideshow() {
  clearInterval(slideshowInterval);
}

document.getElementById("pauseButton").addEventListener("click", () => {
  isPaused = !isPaused;
  const button = document.getElementById("pauseButton");
  if (isPaused) {
    stopSlideshow();
    button.textContent = "Resume";
  } else {
    startSlideshow();
    button.textContent = "Pause";
  }
});

showNextImage();
startSlideshow();

async function UploadImage(image) {
  const formData = new FormData();
  formData.append("image", image);

  try {
    const response = await fetch("https://51.12.220.246:4000/SaveImage", {
      method: "POST",
      body: formData,
    });

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

document.getElementById("img").addEventListener("change", async function () {
  const imageFile = this.files[0];
  if (!imageFile) {
    alert("Please select an image to upload.");
    return;
  }

  const result = await UploadImage(imageFile);
  alert(result);
});

// Show input when mouse is near center of screen
const inputElement = document.getElementById("img");
const popup = document.getElementById("popup");
const controlPanel = document.getElementById("controlPanel");
const centerThreshold = 150;

document.addEventListener("mousemove", (e) => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const cursorX = e.clientX;
  const cursorY = e.clientY;

  const distance = Math.sqrt(
    Math.pow(cursorX - centerX, 2) + Math.pow(cursorY - centerY, 2)
  );

  if (distance < centerThreshold) {
    controlPanel.classList.add("visible");
  } else {
    controlPanel.classList.remove("visible");
  }
});

function flashImage(url) {
  const img = document.createElement("img");
  img.src = url;
  img.style.position = "fixed";
  img.style.top = "0";
  img.style.left = "0";
  img.style.width = "100vw";
  img.style.height = "100vh";
  img.style.objectFit = "cover";
  img.style.zIndex = "9999";
  img.style.pointerEvents = "none";
  img.style.filter = "grayscale(1) brightness(1)";
  document.body.appendChild(img);

  let high = true;
  const interval = 50; // every 50ms
  const duration = 1000;
  const flashes = duration / interval;
  let count = 0;

  const flashInterval = setInterval(() => {
    // Switch between very bright and very dark
    img.style.filter = `grayscale(1) brightness(${high ? 3 : 0.2})`;
    high = !high;
    count++;
    if (count >= flashes) {
      clearInterval(flashInterval);
      document.body.removeChild(img);
    }
  }, interval);
}
