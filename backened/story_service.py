# ---------- IMAGE (OpenRouter Gemini 2.0 Flash Experimental) ----------
import os
import requests
import uuid
import json
import time
import random

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY11")
STABILITY_API_KEY = os.getenv("STABILITY_API_KEY7")  # ✅ add this in your .env

# ---------- STORY ----------


# ---------- IMAGE (OpenRouter Gemini 2.0 Flash Experimental) ---------
# ---------- STORY ----------
def generate_story(data):
    prompt = data.get("prompt", "")
    genre = data.get("genre")
    tone = data.get("tone")
    target_audience = data.get("targetAudience")
    characters = data.get("characters", [])
    art_style = data.get("artStyle")

    # Prepare character names for prompt
    character_names = ", ".join([c["name"] for c in characters]) if characters else "No specific characters"

    # Generate 4 scene IDs
    scene_ids = [str(uuid.uuid4()) for _ in range(4)]
    scene_types = ["introduction", "rising_action", "climax", "resolution"]
    scenes = []

    for i in range(4):
        scene_prompt = f"""
Write scene {i+1} of a {tone} {genre} story for {target_audience}.
Include these characters: {character_names}.
Art style inspiration: {art_style}.
Base the scene on this idea: {prompt} and should be an {scene_types[i]} and if the prompt is same then it should be like continuation of previous paragraph.
Keep the text concise, around 100 words.
"""
        print(scene_prompt)
        story_text = f"Scene {i+1} content could not be generated."  # fallback

        try:
            url = "https://openrouter.ai/api/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "mistralai/mistral-7b-instruct:free",
                "messages": [{"role": "user", "content": scene_prompt}],
                "temperature": 0.7,
                "max_tokens": 400
            }

            response = requests.post(url, headers=headers, json=payload, timeout=30)
            result = response.json()
            print("OpenRouter response:", json.dumps(result, indent=2))  # debug

            choices_list = result.get("choices", [])
            if choices_list:
                message = choices_list[0].get("message") or {}
                story_text = message.get("content") or message.get("text") or story_text

            # Optional: slight delay to avoid hitting API rate limits
            time.sleep(1)

        except Exception as e:
            print(f"Error generating scene {i+1}:", e)

        # Create choices
        choices = [
            {
                "id": str(uuid.uuid4()),
                "text": "Continue adventure",
                "nextSceneId": scene_ids[i+1] if i+1 < len(scene_ids) else ""
            },
            {
                "id": str(uuid.uuid4()),
                "text": "Take a rest",
                "nextSceneId": scene_ids[i+1] if i+1 < len(scene_ids) else ""
            },
        ]

        scenes.append({
            "id": scene_ids[i],
            "title": f"Scene {i+1}",
            "content": story_text,
            "sceneType": scene_types[i],
            "imageUrl": None,
            "choices": choices
        })

    # Return structured story
    return {
        "title": "AI Generated Story",
        "genre": genre,
        "tone": tone,
        "targetAudience": target_audience,
        "scenes": scenes
    }


import base64


def generate_image(data):
    prompt = data.get("prompt", "")
    genre = data.get("genre")
    tone = data.get("tone")
    target_audience = data.get("targetAudience")
    characters = data.get("characters", [])
    art_style = data.get("artStyle")  # should match Stability style_preset values

    # build descriptive prompt
    story_prompt = f"{prompt}, {genre} style, {tone} mood, highly detailed, 4k"

    url = "https://api.stability.ai/v2beta/stable-image/generate/core"

    headers = {
        "Authorization": f"Bearer {STABILITY_API_KEY}",
        "Accept": "application/json"
    }

    # ✅ include style_preset directly in request
    files = {
        "prompt": (None, story_prompt),
        "output_format": (None, "png"),
        "style_preset": (None, art_style) if art_style else None
    }

    # remove None entries (important, otherwise API might break)
    files = {k: v for k, v in files.items() if v is not None}

    try:
        response = requests.post(url, headers=headers, files=files, timeout=60)
        result = response.json()
        print("Stability API Response:", result)  # Debug full response

        image_base64 = result.get("image")
        if image_base64:
            os.makedirs("static", exist_ok=True)
            filename = f"generated_{uuid.uuid4().hex}.png"
            filepath = os.path.join("static", filename)

            with open(filepath, "wb") as f:
                f.write(base64.b64decode(image_base64))

            return {"image_url": f"/static/{filename}"}

        return {"image_url": "https://via.placeholder.com/512.png?text=No+Image"}

    except Exception as e:
        print("Error generating image:", e)
        return {"image_url": "https://via.placeholder.com/512.png?text=Error"}

def generate_narration(data):
    """
    Generate narration audio using Google Gemini 3n 2B (free) via OpenRouter API.
    """
    text = data.get("text", "")
    
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5000",  # optional
        "X-Title": "StoryWeaver"                 # optional
    }

    payload = {
        "model": "google/gemma-3n-e2b-it:free",
        "messages": [
            {"role": "user", "content": text}
        ],
        "modalities": ["text", "audio"],  # request audio output
        "temperature": 0.7
    }

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=60)
        result = response.json()
        # Example structure for audio URL extraction
        audio_url = None
        choices_list = result.get("choices", [])
        if choices_list:
            message_content = choices_list[0].get("message", {}).get("content", [])
            if isinstance(message_content, list):
                for item in message_content:
                    if item.get("type") == "audio_url":
                        audio_url = item.get("audio_url", {}).get("url")
                        break

        return {"audioUrl": audio_url or "https://via.placeholder.com/audio.mp3"}

    except Exception as e:
        print("Error generating narration:", e)
        return {"audioUrl": "https://via.placeholder.com/audio-fallback.mp3"}