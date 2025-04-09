const images = [
  "images/meme1.png",
  "images/meme2.png",
  "images/meme3.png",
  "images/meme4.png",
];

let index = 0;
const img = document.getElementById("slideshow");

function showImage() {
  const preloaded = new Image();
  preloaded.src = images[index];
  preloaded.onload = () => {
    img.style.opacity = 0;
    setTimeout(() => {
      img.src = preloaded.src;
      img.style.opacity = 1;
    }, 500);
  };

  index = (index + 1) % images.length;
}

showImage();
setInterval(showImage, 7000);
