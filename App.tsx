
import React, { useState, useEffect } from 'react';
import { View, User, Story, LandingPageContent } from './types';
import { MOCK_STORIES } from './data';
import { DEFAULT_LANDING_CONTENT } from './defaultContent';
import { Navigation } from './components/Navigation';
import { Landing } from './pages/Landing';
import { Browse } from './pages/Browse';
import { Editor } from './pages/Editor';
import { Auth } from './pages/Auth';
import { Reader } from './pages/Reader';
import { Library } from './pages/Library';
import { Profile } from './pages/Profile';
import { StoryDetail } from './pages/StoryDetail';
import { AdminLogin } from './pages/AdminLogin';
import { CMS } from './pages/CMS';

export default function App() {
  const [currentView, setView] = useState<View>(View.LANDING);
  // Navigation History Stack to handle "Back" correctly
  const [history, setHistory] = useState<View[]>([]);

  const [user, setUser] = useState<User | null>(null);
  
  // Data State
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [savedStoryIds, setSavedStoryIds] = useState<Set<string>>(new Set());
  // Track last read chapter index by story ID
  const [readingProgress, setReadingProgress] = useState<Record<string, number>>({});
  
  // Landing Page Content State (Loaded from LocalStorage)
  const [landingContent, setLandingContent] = useState<LandingPageContent>(DEFAULT_LANDING_CONTENT);

  // Selection State
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [storyToEdit, setStoryToEdit] = useState<Story | null>(null);
  // State to pass to Reader to know where to start
  const [readerStartIndex, setReaderStartIndex] = useState<number>(0);
  
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  // Load Content from LocalStorage on mount
  useEffect(() => {
    const savedContent = localStorage.getItem('storyweave_landing_content');
    if (savedContent) {
      try {
        setLandingContent(JSON.parse(savedContent));
      } catch (e) {
        console.error("Failed to parse saved content", e);
      }
    }
  }, []);

  const handleSaveContent = (newContent: LandingPageContent) => {
    setLandingContent(newContent);
    localStorage.setItem('storyweave_landing_content', JSON.stringify(newContent));
    showToast("Content updated successfully!", "success");
  };

  // Helper to change view and push to history
  const navigateTo = (newView: View) => {
    if (newView !== currentView) {
      setHistory(prev => [...prev, currentView]);
      setView(newView);
    }
  };

  // Helper to go back
  const goBack = () => {
    if (history.length > 0) {
      const prevView = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setView(prevView);
    } else {
      // Default fallback
      setView(View.LANDING);
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    navigateTo(View.BROWSE);
  };

  const handleLogout = () => {
    setUser(null);
    setHistory([]);
    setView(View.LANDING);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    showToast("Profile updated!", "success");
  };

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Story Actions ---

  const handleSelectStory = (story: Story) => {
    setSelectedStory(story);
    navigateTo(View.STORY_DETAIL);
  };

  const handleStartReading = (chapterIndex?: number) => {
    if (!selectedStory) return;
    
    // If specific index passed (clicked on chapter list), use it
    // Otherwise (clicked "Read Now"), resume from progress or start at 0
    let startIndex = 0;
    if (chapterIndex !== undefined) {
        startIndex = chapterIndex;
    } else {
        startIndex = readingProgress[selectedStory.id] || 0;
    }

    setReaderStartIndex(startIndex);
    navigateTo(View.READING);
  };

  const handleUpdateReadingProgress = (storyId: string, index: number) => {
      setReadingProgress(prev => ({
          ...prev,
          [storyId]: index
      }));
  };

  // Nav Bar "Write" -> New Story
  const handleStartWriting = () => {
    setStoryToEdit(null); // Reset for new story
    navigateTo(View.EDITOR);
  };

  // Library "Edit" -> Edit Existing Story
  const handleEditStory = (story: Story) => {
    setStoryToEdit(story);
    navigateTo(View.EDITOR);
  };

  const handleDeleteStory = (storyId: string) => {
    setStories(prev => prev.filter(s => s.id !== storyId));
    setSavedStoryIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(storyId);
        return newSet;
    });
    // Clean up progress
    setReadingProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[storyId];
        return newProgress;
    });
    
    showToast("Story deleted successfully", "success");
  };

  const handleSaveStoryFromEditor = (updatedStory: Story) => {
      // If editing existing, update it
      const existingIndex = stories.findIndex(s => s.id === updatedStory.id);
      
      if (existingIndex >= 0) {
          const newStories = [...stories];
          newStories[existingIndex] = updatedStory;
          setStories(newStories);
          showToast("Story updated successfully!", "success");
      } else {
          // Add new
          setStories([updatedStory, ...stories]);
          showToast("New story created!", "success");
      }
      navigateTo(View.LIBRARY);
  };

  const handleToggleLibrary = (story: Story) => {
      if (!user) {
          navigateTo(View.AUTH);
          return;
      }
      const newSaved = new Set(savedStoryIds);
      if (newSaved.has(story.id)) {
          newSaved.delete(story.id);
          showToast("Removed from Library", "success");
      } else {
          newSaved.add(story.id);
          showToast("Saved to Library", "success");
      }
      setSavedStoryIds(newSaved);
  };

  // Derived lists
  const myStories = stories.filter(s => s.author === 'You' || s.author === user?.name);
  const savedStories = stories.filter(s => savedStoryIds.has(s.id));

  const renderContent = () => {
    switch (currentView) {
      case View.LANDING:
        return (
            <Landing 
                setView={(view) => {
                    if (view === View.EDITOR) handleStartWriting();
                    else navigateTo(view);
                }} 
                onSelectStory={handleSelectStory}
                trendingStories={stories} 
                content={landingContent}
            />
        );
      case View.BROWSE:
        return <Browse stories={stories} onSelectStory={handleSelectStory} />;
      case View.STORY_DETAIL:
        return selectedStory ? (
          <StoryDetail 
            story={selectedStory} 
            onStartReading={handleStartReading} 
            onBack={goBack} 
            onToggleLibrary={handleToggleLibrary}
            isSaved={savedStoryIds.has(selectedStory.id)}
          />
        ) : null;
      case View.READING:
        return selectedStory ? (
          <Reader 
            story={selectedStory} 
            initialChapterIndex={readerStartIndex}
            onSaveProgress={(index) => handleUpdateReadingProgress(selectedStory.id, index)}
            onBack={goBack} 
          />
        ) : null;
      case View.EDITOR:
        return (
            <Editor 
                setView={navigateTo} 
                onBack={goBack}
                showToast={showToast} 
                initialStory={storyToEdit}
                onSaveStory={handleSaveStoryFromEditor}
            />
        );
      case View.AUTH:
        return <Auth onLogin={handleLogin} setView={navigateTo} />;
      case View.LIBRARY:
        return (
            <Library 
                myStories={myStories} 
                savedStories={savedStories} 
                onSelectStory={handleSelectStory}
                onEditStory={handleEditStory}
                onDeleteStory={handleDeleteStory}
            />
        );
      case View.PROFILE:
        return user ? (
            <Profile 
                user={user} 
                stories={myStories}
                savedStories={savedStories}
                onUpdateUser={handleUpdateUser}
                onSelectStory={handleSelectStory}
            />
        ) : <Auth onLogin={handleLogin} setView={navigateTo} />;
      case View.ADMIN_LOGIN:
        return (
          <AdminLogin 
            onLogin={() => {
              showToast("Admin access granted", "success");
              navigateTo(View.CMS);
            }} 
            onBack={goBack} 
          />
        );
      case View.CMS:
        return (
          <CMS 
            initialContent={landingContent}
            onSave={handleSaveContent}
            onExit={() => setView(View.LANDING)}
          />
        );
      default:
        return <Landing setView={navigateTo} onSelectStory={handleSelectStory} trendingStories={stories} content={landingContent}/>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-purple-200 selection:text-purple-900">
      {/* Conditionally render Navigation. Hide in Reader, Editor, CMS, AdminLogin */}
      {![View.READING, View.EDITOR, View.CMS, View.ADMIN_LOGIN].includes(currentView) && (
        <Navigation 
          currentView={currentView} 
          setView={(view) => {
            if (view === View.EDITOR) handleStartWriting();
            else navigateTo(view);
          }} 
          user={user} 
          onLogout={handleLogout} 
        />
      )}
      
      <main>
        {renderContent()}
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl transform transition-all animate-fade-in-up z-50 font-bold border ${
            toast.type === 'success' 
            ? 'bg-white text-green-600 border-green-100' 
            : 'bg-white text-red-600 border-red-100'
        }`}>
            {toast.msg}
        </div>
      )}
    </div>
  );
}
