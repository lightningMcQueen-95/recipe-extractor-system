import os
import json
import psycopg2
from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from scraper import scrape_recipe_url
from google import genai
from dotenv import load_dotenv
from typing import List
import re

load_dotenv()
app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
MODEL_ID = "gemini-3-flash-preview"

def save_to_db(data, url):
    try:
        conn = psycopg2.connect(host="localhost", database="recipe_db", user="postgres", password="1234")
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO recipes (
                url, title, cuisine, difficulty, prep_time, cook_time, total_time, servings,
                ingredients, instructions, nutrition_estimate, substitutions, shopping_list, related_recipes
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (url) DO NOTHING;
        """, (
            url,
            data.get('title'),
            data.get('cuisine'),
            data.get('difficulty'),
            data.get('prep_time'),
            data.get('cook_time'),
            data.get('total_time'),
            data.get('servings'),
            json.dumps(data.get('ingredients')),
            json.dumps(data.get('instructions')),
            json.dumps(data.get('nutrition_estimate')),
            json.dumps(data.get('substitutions')),
            json.dumps(data.get('shopping_list')),
            json.dumps(data.get('related_recipes'))
        ))
        
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Database Error: {e}")

@app.post("/extract")
async def extract(url: str):
    raw_text = scrape_recipe_url(url)
    with open("../prompts/extraction_template.txt", "r") as f:
        prompt_template = f.read()
    
    prompt_text = f"{prompt_template}\n\nTEXT: {raw_text[:7000]}\n\nReturn JSON with keys: title, cuisine, difficulty, prep_time, cook_time, total_time, servings, ingredients, instructions, nutrition_estimate, substitutions, shopping_list, related_recipes."

    response = client.models.generate_content(model=MODEL_ID, contents=prompt_text)
    content = response.text.strip().replace("```json", "").replace("```", "").strip()

    data = json.loads(content)
    print(f"Extracted Title: {data.get('title')}") 

    save_to_db(data, url) 

    filename = data.get('title', 'recipe').lower().replace(" ", "_") + ".json"
    filepath = os.path.join("../sample_data", filename)

    with open(filepath, "w") as f:
        data['url'] = url 
        json.dump(data, f, indent=4)

    urls_filepath = os.path.join("../sample_data", "tested_urls.txt")
    
    with open(urls_filepath, "a") as f:
        f.write(url + "\n")
    return data

@app.get("/history")
async def get_history():
    conn = psycopg2.connect(host="localhost", database="recipe_db", user="postgres", password="1234")
    cur = conn.cursor()
    cur.execute("SELECT title, cuisine, difficulty, prep_time, cook_time, total_time, servings, ingredients, instructions, nutrition_estimate, substitutions, shopping_list, related_recipes, extracted_at, url FROM recipes")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    
    return [{
        "title": r[0], "cuisine": r[1], "difficulty": r[2], "prep_time": r[3],
        "cook_time": r[4], "total_time": r[5], "servings": r[6],
        "ingredients": r[7], "instructions": r[8], "nutrition_estimate": r[9],
        "substitutions": r[10], "shopping_list": r[11], "related_recipes": r[12],
        "date": r[13], "url": r[14]
    } for r in rows]