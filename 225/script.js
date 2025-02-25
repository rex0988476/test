function toggleAnimeInfo(index) {
    let animeItem = document.querySelectorAll(".anime-item")[index];
    let animeInfo = document.querySelectorAll(".anime-info")[index];
    let cover = document.querySelectorAll(".cover")[index];

    animeItem.classList.toggle("active");

    if (animeItem.classList.contains("active")) {
        animeInfo.style.visibility = "hidden";
        animeInfo.style.display = "flex";

        setTimeout(() => {
            let coverHeight = cover.offsetHeight;

            animeInfo.style.width = "70%";
            animeInfo.style.height = `${coverHeight}px`; // **確保高度與封面一致**
            animeInfo.style.visibility = "visible";
        }, 10);
    } else {
        animeInfo.style.width = "0";
        setTimeout(() => {
            animeInfo.style.display = "none";
            animeInfo.style.height = "100%"; // **確保收回時仍然等高**
        }, 300);
    }
}
