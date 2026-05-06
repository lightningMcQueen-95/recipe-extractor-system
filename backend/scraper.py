import requests
from bs4 import BeautifulSoup

def scrape_recipe_url(url):
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        for script in soup(["script", "style"]):
            script.extract()
            
        return soup.get_text(separator=' ', strip=True)
    except Exception as e:
        return f"Error: {str(e)}"