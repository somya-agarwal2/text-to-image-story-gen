const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://text-to-image-story-backened.onrender.com/api';

export class StoryAPI {
  private static async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  static async generateStory(request: any) {
    return this.makeRequest('/generate-story', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  static async generateImage(request: any) {
    return this.makeRequest('/generate-image', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  static async saveStory(story: any) {
    return this.makeRequest('/stories', {
      method: 'POST',
      body: JSON.stringify(story),
    });
  }

  static async getStory(id: string) {
    return this.makeRequest(`/stories/${id}`);
  }

  static async getPublicStories() {
    return this.makeRequest('/stories/public');
  }

  static async upscaleImage(imageUrl: string) {
    return this.makeRequest('/upscale-image', {
      method: 'POST',
      body: JSON.stringify({ imageUrl }),
    });
  }

  static async generateNarration(text: string, voice: string = 'default') {
    return this.makeRequest('/generate-narration', {
      method: 'POST',
      body: JSON.stringify({ text, voice }),
    });
  }
}
