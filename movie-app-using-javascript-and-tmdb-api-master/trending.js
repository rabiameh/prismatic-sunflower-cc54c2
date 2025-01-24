document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.querySelector("input.inp");
  const clearSearchButton = document.getElementById("clear-search-btn");
  const navLinks = document.querySelectorAll(".nav-link a");
  const row = document.querySelector(".row");

  let currentText = document.querySelector("strong");
  let currentYear = new Date().getFullYear();
  currentText.innerHTML = `${currentYear}`;

  const toggleSearchBarVisibility = (show) => {
    searchBar.style.display = show ? "block" : "none";
    clearSearchButton.style.display = show ? "block" : "none";
  };

  navLinks.forEach((link) => {
    if (link.href === window.location.href) {
      link.parentElement.classList.add("active");
      if (link.href.includes("trending.html")) {
        toggleSearchBarVisibility(false);
      } else {
        toggleSearchBarVisibility(true);
      }
    } else {
      link.parentElement.classList.remove("active");
    }
  });

  async function getMovies(API) {
    try {
      const response = await fetch(API);
      const data = await response.json();
      row.innerHTML = "";

      data.results.forEach((movie) => {
        const {
          poster_path,
          name,
          original_title,
          vote_average,
          overview,
          first_air_date,
          release_date,
        } = movie;

        const trdname = name || original_title || "Unknown Title";
        const release =
          first_air_date || release_date || "Unknown Release Date";

        const fetchmovie = document.createElement("div");
        fetchmovie.classList.add("moviebox");

        const img = document.createElement("img");
        img.classList.add("fetchimg");
        img.src = poster_path
          ? `https://image.tmdb.org/t/p/w1280${poster_path}`
          : "https://via.placeholder.com/150?text=No+Image";

        const overlay = document.createElement("div");
        overlay.classList.add("overlay");
        overlay.innerHTML = ` 
          <h2 class="title">${trdname}</h2>
          <p class="tv-show-description">${
            overview || "No description available."
          }</p>
          <h4 class="sub">Release Date: <b>${release}</b></h4> 
          <h4 class="sub">Rating: <b>${vote_average || "N/A"}</b></h4>
        `;
        overlay.style.display = "none";

        fetchmovie.addEventListener("click", () => {
          const isVisible = overlay.style.display === "block";
          if (isVisible) {
            anime({
              targets: overlay,
              opacity: [1, 0], 
              duration: 300,
              easing: "easeInOutQuad",
              complete: () => {
                overlay.style.display = "none";
              },
            });
          } else {
            overlay.style.display = "block";
            anime({
              targets: overlay,
              opacity: [0, 1], 
              duration: 300,
              easing: "easeInOutQuad",
            });
          }
        });

      
        anime({
          targets: fetchmovie,
          opacity: [0, 1], 
          translateY: [20, 0], 
          duration: 500,
          easing: "easeOutExpo",
        });

        fetchmovie.appendChild(img);
        fetchmovie.appendChild(overlay);
        row.appendChild(fetchmovie);
      });
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }

  const API =
    "https://api.themoviedb.org/3/trending/all/day?api_key=ffef63f5e480a5ea5358d8b895638d8f";
  getMovies(API);
});
