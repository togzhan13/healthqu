import requests
import xml.etree.ElementTree as ET
import json
import schedule
import time

def fetch_articles():
    url = "https://export.arxiv.org/api/query?search_query=cat:q-bio.NC&start=0&max_results=3"
    response = requests.get(url)
    root = ET.fromstring(response.content)

    articles = []
    for entry in root.findall("{http://www.w3.org/2005/Atom}entry"):
        title = entry.find("{http://www.w3.org/2005/Atom}title").text
        summary = entry.find("{http://www.w3.org/2005/Atom}summary").text.split(".")[0] + "."
        link = entry.find("{http://www.w3.org/2005/Atom}id").text
        articles.append({"title": title, "tip": summary, "link": link})

    with open("articles.json", "w") as file:
        json.dump(articles, file)

# Run the script every 24 hours
schedule.every(5).seconds.do(fetch_articles)

while True:
    schedule.run_pending()
    time.sleep(1)
