const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const API_KEY = "ffef63f5e480a5ea5358d8b895638d8f";

const topRatedMoviesAPI = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;
const popularMoviesAPI = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;

let currentText = document.querySelector("strong");
let currentYear = new Date().getFullYear();
currentText.innerHTML = `${currentYear}`;

let bd = document.querySelector("input");
let row = document.querySelector(".row");

document.addEventListener("DOMContentLoaded", () => {
 
  setActiveButton("popular-btn");

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

function promptSearchMode(searchTerm) {
  const searchMode = confirm(
    "Click OK to search for movies, or Cancel to search for people."
  );

  if (searchMode) {
    getMovies(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&page=1&query=${searchTerm}`
    );
  } else {
    getPeople(
      `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&language=en-US&page=1&query=${searchTerm}`
    );
  }
}

// Search functionality
const searchForm = document.querySelector("form");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = bd.value;

  if (searchTerm) {
    toggleButtonsVisibility(false);
    promptSearchMode(searchTerm);
    row.innerHTML = "";
  } else {
    alert("Please enter a search term.");
  }
});

document.getElementById("clear-search-btn").addEventListener("click", () => {
  bd.value = "";
  row.innerHTML = "";
  toggleButtonsVisibility(true);

  getMovies(popularMoviesAPI);
});

async function getMovies(API) {
  try {
    const response = await fetch(API);
    if (!response.ok) {
      throw new Error("Failed to fetch movies.");
    }
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      alert("No movies found matching your search.");
      return;
    }

    row.innerHTML = "";

    data.results.forEach((movie) => {
      const {
        poster_path,
        original_title,
        release_date,
        vote_average,
        overview,
      } = movie;

      let movieCard = document.createElement("div");
      movieCard.classList.add("moviebox");

      let img = document.createElement("img");
      img.classList.add("fetchimg");
      img.src = poster_path
        ? `${IMGPATH + poster_path}`
        : "https://via.placeholder.com/150"; 

      let overlay = document.createElement("div");
      overlay.classList.add("overlay");

      const truncatedOverview =
        overview.length > 150 ? overview.substring(0, 150) + "..." : overview;

      overlay.innerHTML = `
        <h2 class="title">${original_title}</h2>
        <p class="description">${truncatedOverview}</p>
        <h4 class="sub">Release Date: <b>${release_date}</b></h4>
        <h4 class="sub">Rating: <b>${vote_average}</b></h4>
      `;

      movieCard.appendChild(img);
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

      movieCard.style.position = "relative";
      movieCard.appendChild(overlay);

      img.addEventListener("click", () => {
        anime({
          targets: overlay,
          opacity: [0, 1], 
          duration: 300,
          easing: "easeOutQuad",
        });
        overlay.style.visibility = "visible";
      });
      overlay.addEventListener("click", () => {
        anime({
          targets: overlay,
          opacity: [1, 0], 
          duration: 300,
          easing: "easeInQuad",
        });
        overlay.style.visibility = "hidden";
      });

      let title = document.createElement("h4");
      title.innerHTML = `${original_title}`;

      let datarow = document.createElement("div");
      datarow.classList.add("datarow");
      datarow.appendChild(title);

      movieCard.appendChild(datarow);
      row.appendChild(movieCard);

      anime({
        targets: movieCard,
        opacity: [0, 1], 
        translateY: [20, 0], 
        duration: 500,
        easing: "easeOutExpo",
      });
    });
  } catch (error) {
    row.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

async function getPeople(API) {
  try {
    const response = await fetch(API);
    if (!response.ok) {
      throw new Error("Failed to fetch people.");
    }
    const data = await response.json();

    row.innerHTML = "";

    if (!data.results || data.results.length === 0) {
      alert("No people found matching your search.");
      return;
    }

    data.results.forEach((person) => {
      const { profile_path, name, known_for_department, known_for } = person;

      let personCard = document.createElement("div");
      personCard.classList.add("personbox");

      let img = document.createElement("img");
      img.classList.add("fetchimg");
      img.src = profile_path
        ? `${IMGPATH + profile_path}`
        : "https://via.placeholder.com/150";

      let overlay = document.createElement("div");
      overlay.classList.add("overlay");
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

      const knownForList = known_for
        .map(
          (item) => `<li>${item.title || item.name} (${item.media_type})</li>`
        )
        .join("");

      overlay.innerHTML = `
        <h2 class="title">${name}</h2>
        <p class="known-for">Known for: ${known_for_department}</p>
        <h3>Famous Work:</h3>
        <ul>${knownForList}</ul>
      `;

      img.addEventListener("click", () => {
        anime({
          targets: overlay,
          opacity: [0, 1], 
          duration: 300,
          easing: "easeOutQuad",
        });
        overlay.style.visibility = "visible";
      });

      overlay.addEventListener("click", () => {
        anime({
          targets: overlay,
          opacity: [1, 0], 
          duration: 300,
          easing: "easeInQuad",
        });
        overlay.style.visibility = "hidden";
      });

      personCard.style.position = "relative";
      personCard.appendChild(img);
      personCard.appendChild(overlay);
      row.appendChild(personCard);
    });
  } catch (error) {
    row.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

document.getElementById("top-rated-btn").addEventListener("click", () => {
  setActiveButton("top-rated-btn");
  getMovies(topRatedMoviesAPI);
});

document.getElementById("popular-btn").addEventListener("click", () => {
  setActiveButton("popular-btn");
  getMovies(popularMoviesAPI);
});

getMovies(popularMoviesAPI);
