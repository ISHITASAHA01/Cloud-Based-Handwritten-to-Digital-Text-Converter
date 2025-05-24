


//card slide 

const carousel = document.getElementById('carousel');
const cards = document.querySelectorAll('.card');
let currentIndex = 0;

// Select the left and right arrow buttons
const leftArrow = document.getElementById('prevArrow');
const rightArrow = document.getElementById('nextArrow');

// Function to update the carousel's position based on the current index
function updateCarouselPosition() {
  // The carousel will translate left by the width of one card for each slide
  const cardWidth = cards[0].offsetWidth + 20; // Including the gap
  carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
}

// Event listener for the left arrow
leftArrow.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = cards.length - 1; // Loop back to the last card
  }
  updateCarouselPosition();
});

// Event listener for the right arrow
rightArrow.addEventListener('click', () => {
  if (currentIndex < cards.length - 1) {
    currentIndex++;
  } else {
    currentIndex = 0; // Loop back to the first card
  }
  updateCarouselPosition();
});

// Initially set the carousel position
updateCarouselPosition();


//
const images = ["./assets/images/image1.jpg", "./assets/images/image2.jpg"]; // Add more images if needed
let index = 0;
const imgElement = document.getElementById("animatedImage");

function changeImage() {
    setTimeout(() => {
        // Apply neon border and rotate 360° from the front
        imgElement.style.transition = "transform 0.3s linear, box-shadow 0.3s ease-in-out, border 0.3s ease-in-out";
        imgElement.style.transform = "rotateY(360deg)";
        imgElement.style.border = "5px solid cyan"; // Neon border
        imgElement.style.boxShadow = "0px 0px 20px cyan"; // Glowing effect

        setTimeout(() => {
            // Switch image after rotation
            index = (index + 1) % images.length;
            imgElement.src = images[index];

            // Reset rotation and remove neon border
            imgElement.style.transition = "none";
            imgElement.style.transform = "rotateY(0deg)";
            imgElement.style.border = "5px solid transparent";
            imgElement.style.boxShadow = "none";

        }, 300); // Rotation duration (max speed)

    }, 2000); // Hold for 2 seconds before rotating
}




function startImageRotation() {
  changeImage();
  setInterval(changeImage, 100);
}

window.addEventListener("load", startImageRotation);

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-right');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open'); // Toggle the 'open' class to show/hide the nav links
});

