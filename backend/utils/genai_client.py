import os
from dotenv import load_dotenv
import google.generativeai as genai 

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY missing in .env")

genai.configure(api_key=GEMINI_API_KEY)

def generate_text(prompt: str, max_output_tokens: int = 512, temperature: float = 0.7):
    """
    Generate text using Gemini (Free version: gemini-2.5-flash)
    """
    try:
        model = genai.GenerativeModel(model_name=GEMINI_MODEL)

        response = model.generate_content(
            prompt,
            generation_config={
                "temperature": temperature,
                "max_output_tokens": max_output_tokens
            }
        )

        if hasattr(response, "text") and response.text:
            return {"success": True, "text": response.text.strip(), "raw": str(response)}
        else:
            return {"success": False, "text": "Empty Gemini response.", "raw": str(response)}

    except Exception as e:
        print("🔥 Gemini Error:", e)
        return {"success": False, "text": f"LLM error: {str(e)}", "raw": None}
