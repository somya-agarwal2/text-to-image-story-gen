export interface Character {
  id: string;
  name: string;
  description: string;
  appearance: string;
  traits: string[];
}

export interface Scene {
  id: string;
  title: string;
  content: string;
  imagePrompt: string;
  imageUrl?: string;
  choices?: SceneChoice[];
  sceneType: 'introduction' | 'rising_action' | 'climax' | 'resolution';
}

export interface SceneChoice {
  id: string;
  text: string;
  nextSceneId: string;
}

export interface Story {
  id: string;
  title: string;
  genre: string;
  tone: string;
  targetAudience: string;
  initialPrompt: string;
  characters: Character[];
  scenes: Scene[];
  currentSceneId: string;
  artStyle: string;
  createdAt: Date;
  author: string;
}

export interface StoryGenerationRequest {
  prompt: string;
  genre?: string;
  tone?: string;
  targetAudience?: string;
  characters?: Character[];
  artStyle?: string;
}

export interface ImageGenerationRequest {
  prompt: string;
  style: string;
  characters?: Character[];
  previousImages?: string[];
}