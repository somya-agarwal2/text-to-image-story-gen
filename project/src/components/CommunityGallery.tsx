import React, { useState, useEffect } from 'react';
import { Search, Heart, Eye, Star, BookOpen } from 'lucide-react';
import { Story } from '../types/Story';
import { StoryViewer } from './StoryViewer';


export const CommunityGallery: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'gallery' | 'viewer'>('gallery');
  const [currentStory, setCurrentStory] = useState<Story | null>(null);

  useEffect(() => {
    const loadStories = async () => {
      setLoading(true);
      try {
        // Mock stories with 4 scenes and local images
        const mockStories: Story[] = [
          {
            id: '1',
            title: 'The Enchanted Library',
            genre: 'fantasy-art',
            tone: 'adventurous',
            targetAudience: 'children',
            initialPrompt: 'A young wizard discovers a hidden library',
            characters: [],
            artStyle: 'fantasy-art',
            createdAt: new Date(),
            author: 'Emma Chen',
            currentSceneId: 's1',
            scenes: [
  {
    id: "s1",
    title: 'Scene 1',
    content: 'The young wizard cautiously steps into a vast, mysterious library. Towering shelves stretch endlessly toward the ceiling, filled with glowing, ancient tomes. Dust motes dance in the air as a faint, magical hum reverberates softly, hinting at secrets waiting to be discovered.',
    imageUrl: 'https://res.cloudinary.com/dvyf4wvd2/image/upload/v1757260269/library3_me9i1a.png'
  },
  {
    id: 's2',
    title: 'Scene 2',
    content: 'As he ventures further, a large, leather-bound book suddenly lifts into the air, its pages fluttering. The book hovers before him and slowly opens, revealing a shimmering spell that seems to glow with a life of its own. The wizard’s eyes widen in awe at the magical spectacle.',
    imageUrl: 'https://res.cloudinary.com/dvyf4wvd2/image/upload/v1757260268/library2_ps6txk.png'
  },
  {
    id: 's3',
    title: 'Scene 3',
    content: 'From the shadows between the shelves, tiny magical creatures peek curiously at the intruder. Their eyes glimmer with intelligence, and they move with graceful, almost ethereal motions. The wizard feels a mix of wonder and trepidation as the creatures silently observe his every step.',
    imageUrl: 'https://res.cloudinary.com/dvyf4wvd2/image/upload/v1757260269/library1_hraaog.png'
  },
  {
    id: 's4',
    title: 'Scene 4',
    content: 'Summoning his courage, the wizard raises his wand and casts his first spell. Brilliant light bursts forth, illuminating every corner of the library. Books float gently around him, and the air shimmers with magic. For the first time, he feels the exhilarating thrill of wielding his newfound powers.',
    imageUrl: 'https://res.cloudinary.com/dvyf4wvd2/image/upload/v1757260269/library4_yiojfo.jpg'
  }
]

          },
          {
            id: '2',
            title: "Robot's First Day",
            genre: 'comic-book',
            tone: 'lighthearted',
            targetAudience: 'children',
            initialPrompt: 'A robot starts school with human children',
            characters: [],
            artStyle: 'cinematic',
            createdAt: new Date(),
            author: 'Alex Rodriguez',
            currentSceneId: 's5',
           scenes: [
  {
    id: 's5',
    title: 'Scene 1',
    content: 'The classroom door creaked open as a shiny, silver robot rolled inside. Its lights blinked with excitement, though its gears whirred nervously. The human students stared in surprise, whispering to each other as the robot waved hello, eager but unsure of how they would react.',
    imageUrl: 'https://res.cloudinary.com/dvyf4wvd2/image/upload/v1757260269/robot1_trj5yx.png',
  },
  {
    id: 's6',
    title: 'Scene 2',
    content: 'The teacher smiled warmly and said, “Class, meet our new student!” She placed a gentle hand on the robot’s shoulder. The children leaned forward in their seats, eyes wide with curiosity. Some looked amazed, others giggled softly, but everyone wondered what it would be like to study with a robot friend.',
    imageUrl: 'https://res.cloudinary.com/dvyf4wvd2/image/upload/v1757260274/robot2_gsew2d.png',
  },
  {
    id: 's7',
    title: 'Scene 3',
    content: 'During recess, the students invited the robot to join a game of tag. The robot eagerly agreed but chased the wrong way, thinking the swings and slide were part of the game. The children laughed, not unkindly, as the robot tilted its head in confusion, trying to learn the rules. Even though it made mistakes, its determination made the classmates smile.',
    imageUrl: 'https://res.cloudinary.com/dvyf4wvd2/image/upload/v1757260271/robot3_eeqpnr.png',
  },
  {
    id: 's8',
    title: 'Scene 4',
    content: 'As the sun dipped low and the final bell rang, the robot sat with a group of new friends, telling jokes in its beeping voice. The children laughed along, offering high-fives and pats on its shiny arms. The robot’s nervous lights now glowed a calm blue — it had discovered that friendship could be programmed through kindness and laughter.',
    imageUrl: 'https://res.cloudinary.com/dvyf4wvd2/image/upload/v1757260271/robot4_kxveuz.jpg',
  },
],

          }
        ];

        setStories(mockStories);
      } catch (error) {
        console.error('Error loading stories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, []);

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || story.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const handleOpenStory = (story: Story) => {
    setCurrentStory(story);
    setCurrentView('viewer');
  };

  if (currentView === 'viewer' && currentStory) {
    return <StoryViewer story={currentStory} setStory={setCurrentStory} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-playfair text-gray-800 mb-4">
            Community Gallery
          </h1>
          <p className="text-xl text-gray-600 font-inter">
            Discover amazing stories created by our community
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-8 border border-white/20">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search stories or authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-teal-200 rounded-2xl focus:border-coral-400 focus:outline-none font-inter"
              />
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-4 py-3 border-2 border-teal-200 rounded-2xl focus:border-coral-400 focus:outline-none font-inter"
              >
                <option value="all">All Genres</option>
                <option value="fantasy">Fantasy</option>
                <option value="adventure">Adventure</option>
                <option value="science-fiction">Sci-Fi</option>
                <option value="mystery">Mystery</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border-2 border-teal-200 rounded-2xl focus:border-coral-400 focus:outline-none font-inter"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="liked">Most Liked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-coral-200 border-t-coral-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-inter">Loading stories...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStories.map((story) => (
              <div
                key={story.id}
                className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
                onClick={() => handleOpenStory(story)}
              >
                {/* Story Cover */}
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-gray-400 group-hover:text-coral-400 transition-colors" />
                </div>
                
                {/* Story Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-playfair text-gray-800 leading-tight group-hover:text-coral-600 transition-colors">
                      {story.title}
                    </h3>
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 font-inter mb-4">
                    by {story.author}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-coral-100 text-coral-800 rounded-full text-sm font-inter">
                      {story.genre}
                    </span>
                    <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-inter">
                      {story.tone}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 font-inter">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>1.2k</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>89</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        <span>4.8</span>
                      </div>
                    </div>
                    <span className="text-xs">
                      {story.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-coral-500/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenStory(story);
                    }}
                    className="mb-6 px-6 py-3 bg-white text-coral-600 rounded-full font-semibold hover:bg-gray-100 transition-colors font-inter"
                  >
                    Read Story
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
