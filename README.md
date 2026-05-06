# Recipe Extraction and Meal Planning System

This project is a full-stack web application designed to automate the process of collecting recipes from the web. It uses BeautifulSoup for web scraping and the Gemini 3 Flash API to process raw HTML into structured recipe data. The system includes a PostgreSQL database to maintain a history of all extracted recipes.

---

## Project Structure
* **backend/**: Contains the FastAPI server (`main.py`) and the scraper logic (`scraper.py`).
* **frontend/**: A React-based UI for interacting with the extraction tool.
* **prompts/**: Contains the text templates used to instruct the LLM.
* **sample_data/**: Automatically stores JSON outputs and a list of tested URLs for evaluation.

---

## Prerequisites
* Python 3.10+
* Node.js and npm
* PostgreSQL 14+
* Google Gemini API Key

---

## Setup and Installation

### 1. Database
Create a database named `recipe_db` in PostgreSQL. Run the following command in your SQL tool to set up the table:
```sql
CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    url TEXT UNIQUE,
    title TEXT,
    cuisine TEXT,
    difficulty TEXT,
    prep_time TEXT,
    cook_time TEXT,
    total_time TEXT,
    servings TEXT,
    ingredients JSONB,
    instructions JSONB,
    nutrition_estimate JSONB,
    substitutions JSONB,
    shopping_list JSONB,
    related_recipes JSONB,
    extracted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
### 2. Backend
1. Navigate to the `backend` directory.
2. Install the required Python libraries:
   `pip install fastapi uvicorn google-genai psycopg2-binary requests beautifulsoup4 python-dotenv`.
3. Create a `.env` file in the `backend` folder and add your key:
   `GEMINI_API_KEY=your_actual_key_here`.
4. Start the server:
   `uvicorn main:app --reload`.

### 3. Frontend
1. Navigate to the `frontend` directory.
2. Install the dependencies:
   `npm install axios`.
3. Start the React app:
   `npm start`.

---

## Usage and Testing
1. Open the application at `http://localhost:3000`.
2. In **Tab 1**, paste a recipe URL and click the extract button. The system will scrape the text, send it to the Gemini model, and display the structured result.
3. Navigate to **Tab 2** to see a history of all recipes saved in the database.
4. Click the "Details" button in the history table to open the recipe in a modal view.
5. Check the `sample_data` folder in the project root to see the generated JSON files and the `tested_urls.txt` log.

---

## API Endpoints
* **POST /extract**: Accepts a URL query parameter, scrapes the site, processes via LLM, and returns structured JSON.
* **GET /history**: Retrieves all saved recipe records from the PostgreSQL database.

---
**By:** Anant Sharma
