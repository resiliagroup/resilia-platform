from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import requests
import json

app = FastAPI()

# HTML dosyanızın adının index.html olduğunu varsayıyoruz
templates = Jinja2Templates(directory=".")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/analyze")
async def analyze_risk(request: Request):
    data = await request.json()
    h = data.get("h_score")
    f = data.get("f_score")
    e = data.get("e_score")
    sector = data.get("sector")

    # Ollama üzerinden yerel Llama 3'e gönderilecek prompt
    prompt = f"""
    Sen OMNI Group'un yapay zeka tabanlı risk analiz asistanısın. 
    Aşağıdaki HFE-360 verilerini analiz et:
    Sektör: {sector}
    Tehlike (H): {h}/100
    Kırılganlık (F): {f}/100
    Kapasite (E): {e}/100
    
    Lütfen bu kuruma özel 3 maddelik stratejik bir tavsiye raporu yaz. 
    Dili profesyonel ve kurumsal olsun.
    """

    # Yerel Ollama API'sine istek atma
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={"model": "llama3", "prompt": prompt, "stream": False}
    )
    
    result = response.json()
    return {"analysis": result['response']}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)