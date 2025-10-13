import os
import zipfile

files = {
    "package.json": """{
  "name": "smaruna-padelis",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}""",
    "vercel.json": """{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "build" }
    }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}""",
    "public/index.html": """<!DOCTYPE html>
<html lang="lt">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Smarūna Padelis</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>""",
    "src/index.js": """import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);""",
    "src/index.css": """body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f3f4f6;
  color: #111827;
}""",
    "src/App.js": """export default function App() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Smarūna Padelis veikia!</h1>
      <p>Vercel deploy testas sėkmingas.</p>
    </div>
  );
}"""
}

# Sukuriame failus
for path, content in files.items():
    dir_path = os.path.dirname(path)
    if dir_path:  # tik jei path turi aplanką
        os.makedirs(dir_path, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

# Sukuriame ZIP
with zipfile.ZipFile("smaruna-padelis.zip", "w", zipfile.ZIP_DEFLATED) as zipf:
    for path in files:
        zipf.write(path)

print("Sukurtas smaruna-padelis.zip su visais failais ✅")
