import React, { useState } from 'react';
import { BookOpen, Users, Sparkles, Menu, X } from 'lucide-react';
import { FloatingParticles } from './components/FloatingParticles';
import { StoryCreator } from './components/StoryCreator';
import { StoryViewer } from './components/StoryViewer';
import { CommunityGallery } from './components/CommunityGallery';
import { StoryAPI } from './services/api';
import { Story, StoryGenerationRequest } from './types/Story';

type AppView = 'home' | 'creator' | 'viewer' | 'gallery';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCreateStory = async (request: StoryGenerationRequest) => {
    setIsGenerating(true);
    try {
      // In a real implementation, this would call your backend API
      // which would then call OpenAI/Claude/etc. APIs
      const generatedStory = await StoryAPI.generateStory(request);

// Generate images for each scene
for (const scene of generatedStory.scenes) {
  const imageData = await StoryAPI.generateImage({
    prompt: scene.imagePrompt,
    style: generatedStory.artStyle,
    characters: scene.characters,
  });

  // Make sure to use the returned URL
  scene.imageUrl = `http://localhost:5000${imageData.image_url}`;
}

setCurrentStory(generatedStory);
setCurrentView('viewer');
    } catch (error) {
      console.error('Error generating story:', error);
      // Show error toast
    } finally {
      setIsGenerating(false);
    }
  };

  const navigationItems = [
    { id: 'home', label: 'Home', icon: BookOpen },
    { id: 'creator', label: 'Create Story', icon: Sparkles },
    { id: 'gallery', label: 'Gallery', icon: Users },
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'creator':
        return <StoryCreator onCreateStory={handleCreateStory} isGenerating={isGenerating} />;
      case 'viewer':
        return currentStory ? (
          <StoryViewer
            story={currentStory}
            setStory={setCurrentStory} 
          />
        ) : null;
      case 'gallery':
        return <CommunityGallery />;
      default:
        return <HomePage onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <FloatingParticles />
      
      {/* Navigation */}
      <nav className="relative z-10 bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer group"
              onClick={() => setCurrentView('home')}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-coral-400 to-coral-500 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-playfair font-bold text-gray-800 group-hover:text-coral-600 transition-colors">
                StoryWeaver
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as AppView)}
                    className={`flex items-center px-4 py-2 rounded-full transition-all font-inter font-medium ${
                      currentView === item.id
                        ? 'bg-gradient-to-r from-coral-400 to-coral-500 text-white shadow-lg'
                        : 'text-gray-600 hover:text-coral-500 hover:bg-coral-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-coral-500 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id as AppView);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 rounded-2xl transition-all font-inter ${
                      currentView === item.id
                        ? 'bg-gradient-to-r from-coral-400 to-coral-500 text-white'
                        : 'text-gray-600 hover:bg-coral-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-5">
        {renderCurrentView()}
      </main>
    </div>
  );
}

// Home Page Component
const HomePage: React.FC<{ onNavigate: (view: AppView) => void }> = ({ onNavigate }) => {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Stories',
      description: 'Create rich, multi-scene narratives with advanced AI that understands character consistency and story structure.',
      color: 'from-coral-400 to-coral-500'
    },
    {
      icon: Users,
      title: 'Community Gallery',
      description: 'Discover amazing stories from our community and share your own creations with readers worldwide.',
      color: 'from-teal-400 to-teal-500'
    },
    {
      icon: BookOpen,
      title: 'Interactive Reading',
      description: 'Experience stories with beautiful illustrations, narration, and branching storylines that engage readers.',
      color: 'from-purple-400 to-purple-500'
    }
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto text-center py-20">
        <h1 className="text-6xl md:text-8xl font-playfair text-gray-800 mb-6 leading-tight">
          Weave Your
          <span className="bg-gradient-to-r from-coral-500 to-teal-500 bg-clip-text text-transparent"> Dreams </span>
          Into Stories
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 font-inter mb-12 max-w-4xl mx-auto leading-relaxed">
          Transform your imagination into beautiful, illustrated stories with the power of AI. 
          Create magical narratives that captivate readers of all ages.
        </p>
        <button
          onClick={() => onNavigate('creator')}
          className="px-12 py-4 bg-gradient-to-r from-coral-500 to-coral-600 text-white text-xl font-bold rounded-full hover:from-coral-600 hover:to-coral-700 transition-all transform hover:scale-105 shadow-2xl font-inter flex items-center gap-3 mx-auto"
        >
          <Sparkles className="w-6 h-6" />
          Start Creating
        </button>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto py-20">
        <h2 className="text-4xl md:text-5xl font-playfair text-center text-gray-800 mb-16">
          Powerful Features for Every Storyteller
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 group hover:-translate-y-2"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-playfair text-gray-800 mb-4 group-hover:text-coral-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 font-inter leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20">
          <h2 className="text-4xl font-playfair text-gray-800 mb-6">
            Ready to Create Something Amazing?
          </h2>
          <p className="text-xl text-gray-600 font-inter mb-8">
            Join thousands of storytellers who are already creating magical narratives with StoryWeaver.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('creator')}
              className="px-8 py-4 bg-gradient-to-r from-coral-500 to-coral-600 text-white font-bold rounded-full hover:from-coral-600 hover:to-coral-700 transition-all transform hover:scale-105 shadow-lg font-inter"
            >
              Create Your Story
            </button>
            <button
              onClick={() => onNavigate('gallery')}
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold rounded-full hover:from-teal-600 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg font-inter"
            >
              Explore Gallery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;