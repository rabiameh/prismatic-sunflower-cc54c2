const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const API_KEY = "ffef63f5e480a5ea5358d8b895638d8f";

const topRatedTVShowsAPI = `https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}&language=en-US&page=1`;
const popularTVShowsAPI = `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=1`;

let currentText = document.querySelector("strong");
let currentYear = new Date().getFullYear();
currentText.innerHTML = `${currentYear}`;

let bd = document.querySelector("input");
let row = document.querySelector(".row");

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link a");

  navLinks.forEach((link) => {
    if (link.href === window.location.href) {
      link.parentElement.classList.add("active");
    } else {
      link.parentElement.classList.remove("active");
    }
  });
});

function toggleButtonsVisibility(isVisible) {
  const topRatedBtn = document.getElementById("top-rated-btn");
  const popularBtn = document.getElementById("popular-btn");

  if (isVisible) {
    topRatedBtn.style.display = "inline-block";
    popularBtn.style.display = "inline-block";
  } else {
    topRatedBtn.style.display = "none";
    popularBtn.style.display = "none";
  }
}

function setActiveButton(activeButtonId) {
  const topRatedBtn = document.getElementById("top-rated-btn");
  const popularBtn = document.getElementById("popular-btn");

  topRatedBtn.style.backgroundColor = "";
  popularBtn.style.backgroundColor = "";

  if (activeButtonId === "top-rated-btn") {
    topRatedBtn.style.backgroundColor = "red";
  } else if (activeButtonId === "popular-btn") {
    popularBtn.style.backgroundColor = "red";
  }
}

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = bd.value;

  toggleButtonsVisibility(false);

  if (searchTerm) {
    getTVShows(
      `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&language=en-US&page=1&query=${searchTerm}`
    );
    row.innerHTML = "";
  } else {
    alert("Please enter a valid search term.");
    row.innerHTML = "<p>No search term provided.</p>";
  }
});

document.getElementById("clear-search-btn").addEventListener("click", () => {
  bd.value = "";
  row.innerHTML = "";
  toggleButtonsVisibility(true);
});

async function getTVShows(API) {
  const response = await fetch(API);
  const data = await response.json();

  row.innerHTML = "";

  if (data.results.length === 0) {
    alert("No results found for the entered search term.");
    row.innerHTML = "<p>No results found.</p>";
    return;
  }

  data.results.forEach((show) => {
    const { poster_path, name, first_air_date, vote_average, overview } = show;

    let showCard = document.createElement("div");
    showCard.classList.add("moviebox");

    let img = document.createElement("img");
    img.classList.add("fetchimg");
    img.src = poster_path
      ? `${IMGPATH + poster_path}`
      : "https://via.placeholder.com/150";

    const truncatedOverview =
      overview.length > 150 ? overview.substring(0, 150) + "..." : overview;

    let overlay = document.createElement("div");
    overlay.classList.add("overlay");
    overlay.innerHTML = `
      <h2 class="title">${name}</h2>
      <p class="tv-show-description">${truncatedOverview}</p>
      <h4 class="sub">First Air Date: <b>${first_air_date}</b></h4>
      <h4 class="sub">Rating: <b>${vote_average}</b></h4>
    `;

    showCard.appendChild(img);
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    overlay.style.color = "white";
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 0.3s ease-in-out";
    overlay.style.visibility = "hidden";

    showCard.style.position = "relative";
    showCard.appendChild(overlay);

    img.addEventListener("click", () => {
      anime({
        targets: overlay,
        opacity: [0, 1], // Fade-in
        duration: 300,
        easing: "easeInOutQuad",
        complete: () => {
          overlay.style.visibility = "visible";
        },
      });
    });

    overlay.addEventListener("click", () => {
      anime({
        targets: overlay,
        opacity: [1, 0], // Fade-out
        duration: 300,
        easing: "easeInOutQuad",
        complete: () => {
          overlay.style.visibility = "hidden";
        },
      });
    });

    anime({
      targets: showCard,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 500,
      easing: "easeOutExpo",
    });

    let title = document.createElement("h4");
    title.innerHTML = `${name}`;

    let datarow = document.createElement("div");
    datarow.classList.add("datarow");
    datarow.appendChild(title);

    showCard.appendChild(datarow);
    row.appendChild(showCard);
  });
}

document.getElementById("clear-search-btn").addEventListener("click", () => {
  bd.value = "";
  row.innerHTML = "";
  toggleButtonsVisibility(true);
  getTVShows(popularTVShowsAPI);
});

document.getElementById("top-rated-btn").addEventListener("click", () => {
  setActiveButton("top-rated-btn");
  getTVShows(topRatedTVShowsAPI);
});

document.getElementById("popular-btn").addEventListener("click", () => {
  setActiveButton("popular-btn");
  getTVShows(popularTVShowsAPI);
});

getTVShows(popularTVShowsAPI);
setActiveButton("popular-btn");
