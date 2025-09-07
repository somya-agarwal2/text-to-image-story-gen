from flask import Flask, request, jsonify
from flask_cors import CORS
from story_service import generate_story, generate_image, generate_narration
import os
import requests
app = Flask(__name__, static_folder="static")
CORS(app)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY11")
STABILITY_API_KEY = os.getenv("STABILITY_API_KEY2")  

# In-memory storage for stories
stories = []

# ---------------- Endpoints ----------------
@app.route("/api/generate-story", methods=["POST"])
def story():
    data = request.json
    result = generate_story(data)
    return jsonify(result)

@app.route("/api/generate-image", methods=["POST"])
def image():
    data = request.json
    result = generate_image(data)
    return jsonify(result)

@app.route("/api/generate-narration", methods=["POST"])
def narration():
    data = request.json
    result = generate_narration(data)
    return jsonify(result)

@app.route("/api/stories", methods=["POST"])
def save_story():
    story = request.json
    stories.append(story)
    return jsonify(story)

@app.route("/api/stories/public", methods=["GET"])
def public_stories():
    return jsonify(stories)

@app.route("/api/stories/<int:id>", methods=["GET"])
def get_story(id):
    return jsonify(stories[id] if id < len(stories) else {})

@app.route("/api/upscale-image", methods=["POST"])
def upscale_image():
    data = request.json
    image_url = data.get("imageUrl")
    # Placeholder: integrate upscaling API if needed
    return jsonify({"upscaledImageUrl": image_url})

# ---------------- Regenerate Scene ----------------
@app.route("/api/regenerate-scene", methods=["POST"])
def regenerate_scene():
    data = request.json
    scene_id = data.get("sceneId")
    prompt = data.get("content", "")
    genre = data.get("genre")
    tone = data.get("tone")
    target_audience = data.get("targetAudience")
    characters = data.get("characters", [])
    art_style = data.get("artStyle")

    scene_prompt = f"""
    Rewrite this scene in a {tone} {genre} story for {target_audience}.
    Characters: {", ".join([c["name"] for c in characters]) if characters else "none"}.
    Art style: {art_style}.
    Base idea: {prompt}.
    Keep it concise, ~70 words.
    """

    story_text = "Scene could not be regenerated."
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
        print(result)
        choices_list = result.get("choices", [])
        if choices_list:
            message = choices_list[0].get("message") or {}
            story_text = message.get("content") or message.get("text") or story_text

    except Exception as e:
        print("Error regenerating scene:", e)

    return jsonify({"id": scene_id, "content": story_text})


# ---------------- Edit Scene ----------------
@app.route("/api/edit-scene", methods=["POST"])
def edit_scene():
    data = request.json
    scene_id = data.get("sceneId")
    new_content = data.get("content")
    return jsonify({"id": scene_id, "content": new_content})


# ---------------- Regenerate Image ----------------
@app.route("/api/regenerate-image", methods=["POST"])
def regenerate_image():
    data = request.json
    scene_id = data.get("sceneId")
    prompt = data.get("prompt", "")
    genre = data.get("genre")
    art_style = data.get("artStyle")

    # reuse your generate_image
    image_result = generate_image({
        "prompt": prompt,
        "genre": genre,
        "artStyle": art_style
    })

    return jsonify({"id": scene_id, "imageUrl": image_result.get("image_url")})







# ---------------- Run ----------------
if __name__ == "__main__":
    app.run(port=5000, debug=True)
