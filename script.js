const images = [
  "images/meme1.png",
  "images/meme2.png",
  "images/meme3.png",
  "images/meme4.png",
  "images/meme5.png",
  "images/meme6.png",
  "images/meme7.png",
  "images/meme8.png",
];

let index = 0;
const img = document.getElementById("slideshow");

// Function to show the next image
async function showNextImage() {
  try {
    // Fetch a random image from the server
    const response = await fetch("http://51.12.220.246:4000/GetNextImage");

    if (response.ok) {
      const data = await response.json();
      const imageUrl = data.url;

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

// Show the first image when the page loads
showNextImage();

// Change image every 7 seconds
setInterval(showNextImage, 7000);

// Upload image function
async function UploadImage(image) {
  const formData = new FormData();
  formData.append("image", image); // Append the image file to the FormData

  try {
    // Send the POST request to the server
    const response = await fetch("http://51.12.220.246:4000/SaveImage", {
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
  document.getElementById("response").textContent = result;
});
