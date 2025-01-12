function fetchArticles() {
    const apiUrl = "https://export.arxiv.org/api/query?search_query=cat:q-bio.NC&start=0&max_results=3";

    fetch(apiUrl)
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            const articles = Array.from(data.querySelectorAll('entry')).map(entry => ({
                title: entry.querySelector('title').textContent,
                tip: entry.querySelector('summary').textContent.split(".")[0] + '.',
                link: entry.querySelector('id').textContent
            }));

            const articleContainer = document.getElementById("articleContainer");
            articleContainer.innerHTML = ''; // Clear previous articles

            articles.forEach(article => {
                const articleItem = document.createElement("div");
                articleItem.classList.add("article-item");

                articleItem.innerHTML = `
                    <h3>${article.title}</h3>
                    <p>${article.tip}</p>
                    <a href="${article.link}" target="_blank">Read More</a>
                `;

                articleContainer.appendChild(articleItem);
            });
        })
        .catch(err => console.error('Error fetching arXiv data: ', err));
}

// Fetch articles immediately and then every 24 hours
fetchArticles();
setInterval(fetchArticles, 86400000);
