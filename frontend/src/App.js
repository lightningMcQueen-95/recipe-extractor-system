import React, { useState } from "react";
import axios from "axios";

const RecipeCard = ({ recipe }) => {
  if (!recipe) return null;

  return (
    <div style={{ lineHeight: "1.6", color: "#333" }}>
      <h2 style={{ borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
        {recipe.title || "Untitled Recipe"}
      </h2>

      <div style={{ marginBottom: "20px", fontSize: "0.95rem", color: "#666" }}>
        <strong>Cuisine:</strong> {recipe.cuisine} |
        <strong> Difficulty:</strong> {recipe.difficulty} |
        <strong> Servings:</strong> {recipe.servings}
        <br />
        <strong>Prep:</strong> {recipe.prep_time} |<strong> Cook:</strong>{" "}
        {recipe.cook_time} |<strong> Total:</strong> {recipe.total_time}
      </div>

      <div style={{ display: "flex", gap: "50px", marginBottom: "20px" }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ borderBottom: "1px solid #ccc" }}>Ingredients</h3>
          <ul>
            {recipe.ingredients?.map((ing, i) => (
              <li key={i}>
                {ing.quantity} {ing.unit} {ing.item}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ borderBottom: "1px solid #ccc" }}>Shopping List</h3>
          {recipe.shopping_list &&
            Object.entries(recipe.shopping_list).map(([cat, items], i) => (
              <div key={i} style={{ marginBottom: "10px" }}>
                <strong style={{ textTransform: "capitalize" }}>{cat}:</strong>
                <ul style={{ marginTop: "5px" }}>
                  {Array.isArray(items) ? (
                    items.map((it, j) => <li key={j}>{it}</li>)
                  ) : (
                    <li>{items}</li>
                  )}
                </ul>
              </div>
            ))}
        </div>
      </div>

      <h3 style={{ borderBottom: "1px solid #ccc" }}>Instructions</h3>
      <ol>
        {recipe.instructions?.map((step, i) => (
          <li key={i} style={{ marginBottom: "10px" }}>
            {step}
          </li>
        ))}
      </ol>

      <h3 style={{ borderBottom: "1px solid #ccc" }}>Related Recipes</h3>
      <ul>
        {recipe.related_recipes?.map((rel, i) => (
          <li key={i}>{rel}</li>
        ))}
      </ul>

      {recipe.nutrition_estimate && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#f9f9f9",
            border: "1px solid #eee",
          }}
        >
          <strong>Nutrition Estimate:</strong>{" "}
          {recipe.nutrition_estimate.calories} calories |{" "}
          {recipe.nutrition_estimate.protein} protein |{" "}
          {recipe.nutrition_estimate.fat} fat |{" "}
          {recipe.nutrition_estimate.carbohydrates} carbs
        </div>
      )}
    </div>
  );
};

function App() {
  const [tab, setTab] = useState(1);
  const [url, setUrl] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleExtract = async () => {
    if (!url) return alert("Please enter a URL");
    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:8000/extract?url=${encodeURIComponent(url)}`
      );
      setRecipe(res.data);
    } catch (err) {
      alert("Extraction failed. Check backend.");
    }
    setLoading(false);
  };

  const loadHistory = async () => {
    try {
      const res = await axios.get("http://localhost:8000/history");
      setHistory(res.data);
    } catch (err) {
      console.error("Error loading history");
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1000px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Recipe Extractor & Meal Planner</h1>

      <div style={{ marginBottom: "30px" }}>
        <button
          onClick={() => setTab(1)}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            cursor: "pointer",
            backgroundColor: tab === 1 ? "#333" : "#eee",
            color: tab === 1 ? "#fff" : "#000",
          }}
        >
          Tab 1: Extract
        </button>
        <button
          onClick={() => {
            setTab(2);
            loadHistory();
          }}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            backgroundColor: tab === 2 ? "#333" : "#eee",
            color: tab === 2 ? "#fff" : "#000",
          }}
        >
          Tab 2: History
        </button>
      </div>

      <hr />

      {tab === 1 ? (
        <div style={{ marginTop: "30px" }}>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Paste recipe URL here..."
              style={{
                width: "70%",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              onClick={handleExtract}
              style={{
                padding: "12px 24px",
                marginLeft: "10px",
                cursor: "pointer",
              }}
              disabled={loading}
            >
              {loading ? "Extracting..." : "Extract Recipe"}
            </button>
          </div>
          {recipe && <RecipeCard recipe={recipe} />}
        </div>
      ) : (
        <div style={{ marginTop: "30px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #ddd",
            }}
          >
            <thead style={{ backgroundColor: "#f4f4f4" }}>
              <tr>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Title
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Cuisine
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Difficulty
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px" }}>{h.title || "Untitled"}</td>
                  <td style={{ padding: "12px" }}>{h.cuisine}</td>
                  <td style={{ padding: "12px" }}>{h.difficulty}</td>
                  <td style={{ padding: "12px" }}>
                    {new Date(h.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <button
                      onClick={() => setSelectedRecipe(h)}
                      style={{ cursor: "pointer" }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedRecipe && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "30px",
              width: "80%",
              maxHeight: "90%",
              overflowY: "auto",
              borderRadius: "8px",
              position: "relative",
            }}
          >
            <button
              onClick={() => setSelectedRecipe(null)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                padding: "5px 15px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
            <RecipeCard recipe={selectedRecipe} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
