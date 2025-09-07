import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  RefreshCw,
  Download,
  Share2,
} from 'lucide-react';
import { Story } from '../types/Story';
import jsPDF from 'jspdf';


interface StoryViewerProps {
  story: Story;
  setStory: (story: Story) => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ story, setStory }) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({});

  const scenes = story?.scenes || [];
  const totalScenes = scenes.length;
  const currentScene = scenes[currentSceneIndex] || null;

  // Preload images
  useEffect(() => {
    scenes.forEach((scene) => {
      if (scene.imageUrl && !loadedImages[scene.id]) {
        const img = new Image();
        img.src = scene.imageUrl;
        img.onload = () =>
          setLoadedImages((prev) => ({ ...prev, [scene.id]: true }));
      }
    });
  }, [scenes, loadedImages]);

  if (!currentScene) {
    return (
      <div className="p-8 text-center text-gray-600">
        No story or scenes available.
      </div>
    );
  }

  const nextScene = () =>
    setCurrentSceneIndex(Math.min(currentSceneIndex + 1, totalScenes - 1));
  const previousScene = () =>
    setCurrentSceneIndex(Math.max(currentSceneIndex - 1, 0));

  /** ------------------ API CALLS ------------------ **/
  const handleRegenerateScene = async (sceneId: string) => {
    const res = await fetch('https://text-to-image-story-backened.onrender.com/api/regenerate-scene', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sceneId,
        content: currentScene.content,
        genre: story.genre,
        tone: story.tone,
        targetAudience: story.targetAudience,
        characters: story.characters,
        artStyle: story.artStyle,
      }),
    });
    const data = await res.json();

    const updatedScenes = story.scenes.map((s) =>
      s.id === sceneId ? { ...s, content: data.content } : s
    );
    setStory({ ...story, scenes: updatedScenes });
  };

  const handleEditScene = async (sceneId: string) => {
    const newContent = prompt('Edit scene text:', currentScene.content);
    if (!newContent) return;

    const res = await fetch('http://localhost:5000/api/edit-scene', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sceneId, content: newContent }),
    });
    const data = await res.json();

    const updatedScenes = story.scenes.map((s) =>
      s.id === sceneId ? { ...s, content: data.content } : s
    );
    setStory({ ...story, scenes: updatedScenes });
  };

  const handleRegenerateImage = async (sceneId: string) => {
    const res = await fetch('https://text-to-image-story-backened.onrender.com/api/regenerate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sceneId,
      content: currentScene.content,
        genre: story.genre,
  tone: story.tone,
  targetAudience: story.targetAudience,
  characters: story.characters,
        artStyle: story.artStyle,
      }),
    });
    const data = await res.json();

    const updatedScenes = story.scenes.map((s) =>
      s.id === sceneId ? { ...s, imageUrl: data.imageUrl } : s
    );
    setStory({ ...story, scenes: updatedScenes });
  };

  /** ------------------ SHARE / EXPORT ------------------ **/
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: story.title,
        text: `Check out this story: ${story.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleExport = async () => {
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 40;
    let y = margin;

    pdf.setFontSize(20);
    pdf.text(story.title, pageWidth / 2, y, { align: 'center' });
    y += 30;

    pdf.setFontSize(12);
    pdf.text(`Genre: ${story.genre}`, margin, y);
    y += 20;
    pdf.text(`Tone: ${story.tone}`, margin, y);
    y += 20;
    pdf.text(`Target Audience: ${story.targetAudience}`, margin, y);
    y += 40;

    for (const scene of story.scenes) {
      pdf.setFontSize(16);
      pdf.text(scene.title, margin, y);
      y += 25;

      pdf.setFontSize(12);
      const splitText = pdf.splitTextToSize(scene.content, pageWidth - 2 * margin);
      pdf.text(splitText, margin, y);
      y += splitText.length * 15 + 10;

      if (scene.imageUrl) {
        try {
          const img = await fetch(scene.imageUrl);
          const blob = await img.blob();
          const reader = new FileReader();

          await new Promise((resolve) => {
            reader.onloadend = () => {
              pdf.addImage(
                reader.result as string,
                'PNG',
                margin,
                y,
                pageWidth - 2 * margin,
                200
              );
              y += 220;
              resolve(null)
            };
            reader.readAsDataURL(blob);
          });
        } catch (err) {
          console.error('Error loading image:', err);
        }
      }

      y += 20;

      if (y > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        y = margin;
      }
    }

    pdf.save(`${story.title.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Story Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-playfair text-gray-800 mb-4 leading-tight">
            {story.title}
          </h1>
        </div>

        {/* Main Story Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Scene Image */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20">
              <div className="aspect-square flex items-center justify-center">
                {currentScene.imageUrl ? (
                  loadedImages[currentScene.id] ? (
                    <img
                      src={currentScene.imageUrl}
                      alt={currentScene.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-600">Loading image...</div>
                  )
                ) : (
                  <div className="text-gray-600">No image</div>
                )}
              </div>

              {/* Regenerate Image Button */}
              <div className="p-2 flex justify-center">
                <button
                  onClick={() => handleRegenerateImage(currentScene.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow hover:shadow-lg transition"
                >
                  <RefreshCw className="w-4 h-4" /> Regenerate Image
                </button>
              </div>
            </div>
          </div>

          {/* Scene Text */}
          <div className="order-1 lg:order-2">
            <div className="bg-white/90 rounded-3xl shadow-2xl p-8 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-playfair">{currentScene.title}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditScene(currentScene.id)}
                    className="p-2 text-gray-500 hover:text-coral-500"
                    title="Edit scene"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleRegenerateScene(currentScene.id)}
                    className="p-2 text-gray-500 hover:text-teal-500"
                    title="Regenerate scene"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <p className="text-lg text-gray-700">{currentScene.content}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={previousScene}
            disabled={currentSceneIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" /> Previous
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow"
            >
              <Share2 className="w-5 h-5" /> Share
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow"
            >
              <Download className="w-5 h-5" /> Export
            </button>

            <button
              onClick={nextScene}
              disabled={currentSceneIndex === totalScenes - 1}
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow disabled:opacity-50"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
