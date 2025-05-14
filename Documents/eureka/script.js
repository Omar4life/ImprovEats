
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Select all <h1> elements and loop through them
document.querySelectorAll("h1").forEach((element) => {
  element.onmouseover = (event) => {
    let iterations = 0;

    const interval = setInterval(() => {
      event.target.innerText = event.target.innerText
        .split("")
        .map((letter, index) => {
          if (index < iterations) {
            return event.target.dataset.value[index];
          }
          return letters[Math.floor(Math.random() * 26)];
        })
        .join("");
        
      if (iterations >= event.target.dataset.value.length) {
        clearInterval(interval);
      }
      iterations += 1 / 3;
    }, 30);
  };
});

// stars
function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function createStar() {
  const star = document.createElement("div");
  star.className = "star";

  const x = getRandom(0, window.innerWidth);
  const y = getRandom(0, window.innerHeight);

  star.style.left = `${x}px`;
  star.style.top = `${y}px`;

  document.body.appendChild(star);
}

function createStars(numStars) {
  for (let i = 0; i < numStars; i++) {
    createStar();
  }
}

const numStars = 100;
createStars(numStars);