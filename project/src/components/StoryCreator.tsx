import React, { useState } from 'react';
import { Wand2, Users, Palette, BookOpen, Sparkles, Plus, X } from 'lucide-react';
import { Character, StoryGenerationRequest } from '../types/Story';

interface StoryCreatorProps {
  onCreateStory: (request: StoryGenerationRequest) => void;
  isGenerating?: boolean;
}

export const StoryCreator: React.FC<StoryCreatorProps> = ({ onCreateStory, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState('fantasy-art');
  const [tone, setTone] = useState('adventurous');
  const [targetAudience, setTargetAudience] = useState('children');
  const [artStyle, setArtStyle] = useState('fantasy-art');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [showCharacterForm, setShowCharacterForm] = useState(false);
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    description: '',
    appearance: '',
    traits: ''
  });

  const genres = ['fantasy-art', 'adventure', 'mystery', 'science-fiction', 'romance', 'horror', 'comedy', 'drama'];
  const tones = ['adventurous', 'mysterious', 'lighthearted', 'dramatic', 'suspenseful', 'romantic', 'humorous'];
  const audiences = ['children', 'young-adult', 'adult', 'all-ages'];
  const artStyles = ['fantasy-art', 'photographic', 'comic-book', 'anime', 'watercolor', 'digital-art', 'pixel-art'];

  const addCharacter = () => {
    if (newCharacter.name.trim()) {
      const character: Character = {
        id: Date.now().toString(),
        name: newCharacter.name,
        description: newCharacter.description,
        appearance: newCharacter.appearance,
        traits: newCharacter.traits.split(',').map(t => t.trim()).filter(t => t),
      };
      setCharacters([...characters, character]);
      setNewCharacter({ name: '', description: '', appearance: '', traits: '' });
      setShowCharacterForm(false);
    }
  };

  const removeCharacter = (id: string) => {
    setCharacters(characters.filter(c => c.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     console.log('Prompt:', prompt);
  console.log('Genre:', genre);
  console.log('Tone:', tone);
  console.log('Audience:', targetAudience);
  console.log('Art Style:', artStyle);
  console.log('Characters:', characters);
    if (prompt.trim()) {
      onCreateStory({
        prompt,
        genre,
        tone,
        targetAudience,
        characters,
        artStyle
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Wand2 className="w-12 h-12 text-coral-500 mr-3" />
            <h1 className="text-5xl font-playfair text-gray-800">Story Creator</h1>
          </div>
          <p className="text-xl text-gray-600 font-inter">
            Transform your imagination into a magical illustrated story
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Story Prompt */}
          <div className="space-y-3">
            <label className="flex items-center text-lg font-semibold text-gray-800 font-inter">
              <BookOpen className="w-5 h-5 mr-2 text-coral-500" />
              Your Story Idea
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your story idea in a few sentences... For example: 'A young wizard discovers a hidden library beneath their school that contains books that come to life when opened.'"
              className="w-full h-32 p-4 border-2 border-teal-200 rounded-2xl focus:border-coral-400 focus:outline-none resize-none text-gray-700 font-merriweather transition-colors"
              required
            />
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 font-inter">Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full p-3 border-2 border-teal-200 rounded-xl focus:border-coral-400 focus:outline-none font-inter"
              >
                {genres.map(g => (
                  <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1).replace('-', ' ')}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 font-inter">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-3 border-2 border-teal-200 rounded-xl focus:border-coral-400 focus:outline-none font-inter"
              >
                {tones.map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 font-inter">Audience</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full p-3 border-2 border-teal-200 rounded-xl focus:border-coral-400 focus:outline-none font-inter"
              >
                {audiences.map(a => (
                  <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1).replace('-', ' ')}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center text-sm font-semibold text-gray-700 font-inter">
                <Palette className="w-4 h-4 mr-1" />
                Art Style
              </label>
              <select
                value={artStyle}
                onChange={(e) => setArtStyle(e.target.value)}
                className="w-full p-3 border-2 border-teal-200 rounded-xl focus:border-coral-400 focus:outline-none font-inter"
              >
                {artStyles.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Characters Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center text-lg font-semibold text-gray-800 font-inter">
                <Users className="w-5 h-5 mr-2 text-coral-500" />
                Characters ({characters.length})
              </label>
              <button
                type="button"
                onClick={() => setShowCharacterForm(true)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-full hover:from-teal-500 hover:to-teal-600 transition-all transform hover:scale-105 font-inter"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Character
              </button>
            </div>

            {characters.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {characters.map(character => (
                  <div key={character.id} className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-200 relative">
                    <button
                      type="button"
                      onClick={() => removeCharacter(character.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <h4 className="font-bold text-gray-800 font-inter mb-1">{character.name}</h4>
                    <p className="text-sm text-gray-600 font-merriweather mb-2">{character.description}</p>
                    <p className="text-xs text-gray-500 font-inter">{character.appearance}</p>
                    {character.traits.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {character.traits.map(trait => (
                          <span key={trait} className="px-2 py-1 bg-white/50 rounded-full text-xs text-gray-600 font-inter">
                            {trait}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {showCharacterForm && (
              <div className="bg-white border-2 border-purple-200 rounded-2xl p-6">
                <h4 className="font-bold text-gray-800 font-inter mb-4">Add New Character</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Character name"
                    value={newCharacter.name}
                    onChange={(e) => setNewCharacter({...newCharacter, name: e.target.value})}
                    className="p-3 border border-purple-200 rounded-xl focus:border-coral-400 focus:outline-none font-inter"
                  />
                  <input
                    type="text"
                    placeholder="Brief description"
                    value={newCharacter.description}
                    onChange={(e) => setNewCharacter({...newCharacter, description: e.target.value})}
                    className="p-3 border border-purple-200 rounded-xl focus:border-coral-400 focus:outline-none font-inter"
                  />
                </div>
                <textarea
                  placeholder="Physical appearance"
                  value={newCharacter.appearance}
                  onChange={(e) => setNewCharacter({...newCharacter, appearance: e.target.value})}
                  className="w-full p-3 border border-purple-200 rounded-xl focus:border-coral-400 focus:outline-none mb-4 font-merriweather"
                  rows={2}
                />
                <input
                  type="text"
                  placeholder="Traits (comma-separated: brave, curious, kind)"
                  value={newCharacter.traits}
                  onChange={(e) => setNewCharacter({...newCharacter, traits: e.target.value})}
                  className="w-full p-3 border border-purple-200 rounded-xl focus:border-coral-400 focus:outline-none mb-4 font-inter"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={addCharacter}
                    className="px-6 py-2 bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-full hover:from-teal-500 hover:to-teal-600 transition-all font-inter"
                  >
                    Add Character
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCharacterForm(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors font-inter"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <div className="text-center pt-6">
            <button
              type="submit"
              disabled={!prompt.trim() || isGenerating}
              className="px-12 py-4 bg-gradient-to-r from-coral-500 to-coral-600 text-white text-xl font-bold rounded-full hover:from-coral-600 hover:to-coral-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg font-inter flex items-center gap-3 mx-auto"
            >
              {isGenerating ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  Weaving Your Story...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Create My Story
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};