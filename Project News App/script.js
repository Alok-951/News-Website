const API_KEY = "1f0ef25771d74023a3118716b153dfc3";
const everythingUrl = "https://newsapi.org/v2/everything?q=";

function getFormattedDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day-1}`;
}

// Get today's date
const today = new Date();
const formattedDate = getFormattedDate(today);

console.log(formattedDate)

const topHeadlinesUrl = `https://newsapi.org/v2/everything?q=apple&from=${formattedDate}&to=${formattedDate}&sortBy=popularity&apiKey=${API_KEY}`;


window.addEventListener("load", () => fetchTopHeadlines());

// jab ham home wala image pe click kr rhe hn jo ki top left me hn toh fir se reset hoke starting wala home page aa jaye
function reload() {
    window.location.reload();
}

async function fetchTopHeadlines() {
    const res = await fetch(topHeadlinesUrl);
    const data = await res.json();
    bindData(data.articles);
}

async function fetchNews(query) {
    const res = await fetch(`${everythingUrl}${query}&language=en&apiKey=${API_KEY}`);
    const data = await res.json();
    console.log(data.articles)
    bindData(data.articles);
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    // isko empty rakhe hn taaki baar jb api call ayega toh phle reh ke aage ayega toh dher sara aate jayega ek ke baad ek
    cardsContainer.innerHTML = "";
    //

    // ek ek article se data fetch krne ke liye
    articles.forEach((article) => {
        // if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name}  ${date}`;

    // jab ham kisi b news box pe click krenge toh another window me us particular new ka details paane ke liye
    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}
//

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}
//

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

// jb top right me box me kuchh search kr rhe hn toh wo news aaye
searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    // jaise ham finance pe click kiye hn or search b kr diye toh search wala item ayega pr finace wala pe active na dikhaye isliye ye code h 
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
    //
});