
import React, { useState, useEffect } from 'react';
import { View, Story, Chapter } from '../types';
import { geminiService } from '../services/geminiService';
import { Save, ArrowLeft, Wand2, Tag, AlertTriangle, Plus, Trash2, GripVertical, Settings, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface EditorProps {
  setView: (view: View) => void;
  onBack: () => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
  initialStory: Story | null; // null means creating a new story
  onSaveStory: (story: Story) => void;
}

export const Editor: React.FC<EditorProps> = ({ setView, onBack, showToast, initialStory, onSaveStory }) => {
  // State initialization needs to react to initialStory changes
  const [storyId, setStoryId] = useState(initialStory?.id || Date.now().toString());
  const [title, setTitle] = useState(initialStory?.title || 'Untitled Story');
  const [genre, setGenre] = useState(initialStory?.genre || 'Fantasy');
  const [synopsis, setSynopsis] = useState(initialStory?.summary || '');
  const [tags, setTags] = useState(initialStory?.tags.join(', ') || '');
  const [coverUrl, setCoverUrl] = useState(initialStory?.coverUrl || 'https://picsum.photos/300/450');
  
  const [chapters, setChapters] = useState<Chapter[]>(initialStory?.chapters || [
      { id: '1', title: 'Chapter 1: The Beginning', content: '' }
  ]);
  const [activeChapterId, setActiveChapterId] = useState<string>(chapters[0]?.id || '1');

  // Reset state when initialStory prop changes (e.g. switching from Edit to New)
  useEffect(() => {
    if (initialStory) {
        setStoryId(initialStory.id);
        setTitle(initialStory.title);
        setGenre(initialStory.genre);
        setSynopsis(initialStory.summary);
        setTags(initialStory.tags.join(', '));
        setCoverUrl(initialStory.coverUrl);
        setChapters(initialStory.chapters);
        setActiveChapterId(initialStory.chapters[0].id);
    } else {
        // Reset for new story
        setStoryId(Date.now().toString());
        setTitle('Untitled Story');
        setGenre('Fantasy');
        setSynopsis('');
        setTags('');
        setCoverUrl('https://picsum.photos/300/450');
        const newChapterId = Date.now().toString();
        setChapters([{ id: newChapterId, title: 'Chapter 1: The Beginning', content: '' }]);
        setActiveChapterId(newChapterId);
    }
  }, [initialStory]);

  // Computed state for active chapter
  const activeChapter = chapters.find(c => c.id === activeChapterId) || chapters[0];
  
  const [showAiPanel, setShowAiPanel] = useState(true);

  // AI State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [moderationResult, setModerationResult] = useState<'approved' | 'flagged' | null>(null);

  // Sync content change to local state immediately
  const handleContentChange = (newContent: string) => {
      setChapters(prev => prev.map(c => c.id === activeChapterId ? { ...c, content: newContent } : c));
  };

  const handleTitleChange = (newTitle: string) => {
      setChapters(prev => prev.map(c => c.id === activeChapterId ? { ...c, title: newTitle } : c));
  }

  const handleAddChapter = () => {
      const newId = Date.now().toString();
      const newChapter = {
          id: newId,
          title: `Chapter ${chapters.length + 1}: Untitled`,
          content: ''
      };
      setChapters([...chapters, newChapter]);
      setActiveChapterId(newId);
  };

  const handleDeleteChapter = (chapterId: string) => {
      if (chapters.length <= 1) {
          showToast("You must have at least one chapter.", "error");
          return;
      }
      if (window.confirm("Are you sure you want to delete this chapter?")) {
          const newChapters = chapters.filter(c => c.id !== chapterId);
          setChapters(newChapters);
          // If we deleted the active chapter, switch to the first available one
          if (activeChapterId === chapterId) {
              setActiveChapterId(newChapters[0].id);
          }
      }
  };

  const handleGenerateIdea = async (type: 'twist' | 'rewrite') => {
    setIsAiLoading(true);
    const context = activeChapter.content.slice(-500) || title;
    const result = await geminiService.generateStoryIdeas(context, type);
    setAiSuggestion(result);
    setIsAiLoading(false);
  };

  const handleAutoTag = async () => {
    if (activeChapter.content.length < 50) {
        showToast("Write more content first!", 'error');
        return;
    }
    setIsAiLoading(true);
    const result = await geminiService.autoTagStory(activeChapter.content);
    setGenre(result.genre);
    setTags(result.tags.join(', '));
    setIsAiLoading(false);
    showToast("Tags generated successfully!", 'success');
  };

  const handleModeration = async () => {
      if (activeChapter.content.length < 5) {
        showToast("Content too short to check.", 'error');
        return;
      }
      setIsAiLoading(true);
      setModerationResult(null); // Reset previous result
      const result = await geminiService.moderateContent(activeChapter.content);
      if (result.includes("Approved")) {
          setModerationResult('approved');
          showToast("Content looks safe!", 'success');
      } else {
          setModerationResult('flagged');
          showToast("Potential issues found.", 'error');
      }
      setIsAiLoading(false);
  };

  const handleSave = () => {
      const updatedStory: Story = {
          id: storyId,
          title,
          genre,
          tags: tags.split(',').map(t => t.trim()).filter(t => t),
          summary: synopsis,
          coverUrl,
          author: initialStory?.author || 'You',
          chapters,
          rating: initialStory?.rating || 0,
          views: initialStory?.views || 0,
          completed: initialStory?.completed || false,
          isSaved: false
      };
      onSaveStory(updatedStory);
  };

  return (
    <div className="flex h-[calc(100vh-65px)] overflow-hidden bg-white text-slate-800 font-sans">
      
      {/* LEFT SIDEBAR: CHAPTERS */}
      <div className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col flex-shrink-0">
         <div className="p-4 border-b border-slate-200 bg-white">
             <button onClick={onBack} className="flex items-center text-slate-500 hover:text-purple-600 cursor-pointer text-sm mb-4 font-medium transition-colors">
                 <ArrowLeft className="w-4 h-4 mr-2" /> Back
             </button>
             <h2 className="font-bold text-slate-900 truncate text-lg font-serif">{title}</h2>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{chapters.length} Chapters</p>
         </div>
         
         <div className="flex-1 overflow-y-auto p-3 space-y-2">
             <button 
                onClick={handleAddChapter}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-white border border-slate-200 text-slate-500 hover:border-purple-300 hover:text-purple-600 transition-all text-left mb-2 shadow-sm"
             >
                 <div className="bg-purple-50 p-1 rounded-md"><Plus className="w-4 h-4" /></div>
                 <span className="text-sm font-bold">Add New Chapter</span>
             </button>

             {chapters.map((chapter, index) => (
                 <div 
                    key={chapter.id}
                    onClick={() => setActiveChapterId(chapter.id)}
                    className={`group flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all border ${
                        activeChapterId === chapter.id 
                            ? 'bg-white border-purple-200 shadow-md' 
                            : 'border-transparent hover:bg-white hover:border-slate-200'
                    }`}
                 >
                     <GripVertical className={`w-4 h-4 ${activeChapterId === chapter.id ? 'text-purple-400' : 'text-slate-300'}`} />
                     <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Chapter {index + 1}</span>
                        <span className={`text-sm font-medium truncate ${activeChapterId === chapter.id ? 'text-purple-700' : 'text-slate-600'}`}>
                            {chapter.title}
                        </span>
                     </div>
                     <button 
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            handleDeleteChapter(chapter.id); 
                        }}
                        className="p-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Chapter"
                     >
                         <Trash2 className="w-4 h-4" />
                     </button>
                 </div>
             ))}
         </div>
      </div>

      {/* CENTER: MAIN EDITOR */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
         {/* Top Header / Actions */}
         <div className="h-16 border-b border-slate-100 bg-white/80 backdrop-blur-sm flex items-center justify-between px-8">
             <div className="flex items-center gap-4 text-sm">
                 <span className="text-slate-400 font-medium">Editing: <span className="text-slate-900 font-serif font-bold">{title}</span></span>
                 <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1 font-bold border border-green-100"><CheckCircle2 className="w-3 h-3"/> Saved</span>
             </div>
             <div className="flex items-center gap-2">
                 <button 
                    onClick={handleSave}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-full transition-colors flex items-center gap-2 shadow-lg shadow-slate-200"
                 >
                     <Save className="w-4 h-4" />
                     Save & Publish
                 </button>
                 <button className="p-2.5 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors border border-transparent hover:border-slate-200">
                     <Settings className="w-5 h-5" />
                 </button>
                 <button 
                    onClick={() => setShowAiPanel(!showAiPanel)}
                    className={`p-2.5 rounded-full transition-colors border ${showAiPanel ? 'bg-purple-50 text-purple-600 border-purple-100' : 'hover:bg-slate-50 text-slate-400 border-transparent hover:border-slate-200'}`}
                 >
                     <Wand2 className="w-5 h-5" />
                 </button>
             </div>
         </div>

         {/* Scrollable Area */}
         <div className="flex-1 overflow-y-auto p-8 bg-[#fdfbf7]">
             <div className="max-w-3xl mx-auto flex flex-col gap-10">
                 
                 {/* Story Details Section */}
                 <section className="bg-white rounded-2xl border border-slate-100 p-8 space-y-6 shadow-sm">
                     <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3 font-serif">Story Settings</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Story Title</label>
                             <input 
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all font-serif"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                             />
                         </div>
                         <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Genre</label>
                             <select 
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                             >
                                 <option>Sci-Fi</option>
                                 <option>Romance</option>
                                 <option>Mystery</option>
                                 <option>Horror</option>
                                 <option>Fantasy</option>
                             </select>
                         </div>
                     </div>
                     <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Synopsis</label>
                         <textarea 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 min-h-[100px] transition-all"
                            placeholder="Write a short summary..."
                            value={synopsis}
                            onChange={(e) => setSynopsis(e.target.value)}
                         />
                     </div>
                     <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tags</label>
                         <div className="flex gap-2">
                             <input 
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                             />
                             <button 
                                onClick={handleAutoTag}
                                disabled={isAiLoading}
                                className="px-4 py-2 bg-white text-purple-600 hover:bg-purple-50 rounded-lg text-sm font-bold border border-purple-100 flex items-center gap-2 shadow-sm transition-all"
                             >
                                 {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Tag className="w-4 h-4"/>}
                                 Auto-Tag
                             </button>
                         </div>
                     </div>
                 </section>

                 {/* Chapter Editor Section */}
                 <section className="flex flex-col gap-6">
                     <input 
                        type="text"
                        className="w-full bg-transparent border-none text-3xl font-bold font-serif text-slate-900 placeholder-slate-300 focus:ring-0 px-0 focus:outline-none"
                        value={activeChapter.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Enter Chapter Title"
                     />
                     
                     <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                         {/* Toolbar */}
                         <div className="flex items-center gap-2 p-2 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10">
                             {['B', 'I', 'U'].map(btn => (
                                 <button key={btn} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-slate-500 font-serif font-bold transition-all">
                                     {btn}
                                 </button>
                             ))}
                             <div className="w-px h-5 bg-slate-200 mx-2"></div>
                             <button className="px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-sm text-slate-500 text-sm font-medium transition-all">H1</button>
                             <button className="px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-sm text-slate-500 text-sm font-medium transition-all">H2</button>
                         </div>
                         
                         {/* Text Area */}
                         <textarea 
                            className="w-full min-h-[600px] p-8 bg-transparent border-none text-slate-800 text-xl leading-loose focus:ring-0 font-serif resize-none focus:outline-none"
                            placeholder="Once upon a time..."
                            value={activeChapter.content}
                            onChange={(e) => handleContentChange(e.target.value)}
                         />
                         
                         {/* Footer Stats */}
                         <div className="flex items-center justify-end gap-6 p-3 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-400 font-bold uppercase tracking-wider">
                             <span>Word Count: {activeChapter.content.split(/\s+/).filter(w => w.length > 0).length}</span>
                             <span>Characters: {activeChapter.content.length}</span>
                         </div>
                     </div>
                 </section>

             </div>
         </div>
      </div>

      {/* RIGHT SIDEBAR: AI TOOLS (Collapsible) */}
      {showAiPanel && (
          <div className="w-80 bg-white border-l border-slate-200 flex flex-col flex-shrink-0 shadow-xl z-20">
              <div className="p-5 border-b border-slate-100 bg-purple-50/30">
                  <h3 className="font-bold text-indigo-950 flex items-center gap-2">
                      <Wand2 className="w-5 h-5 text-purple-600" />
                      AI Muse
                  </h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 space-y-8">
                  {/* Suggestions */}
                  <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Spark Creativity</h4>
                      <div className="grid grid-cols-2 gap-3">
                          <button 
                            disabled={isAiLoading}
                            onClick={() => handleGenerateIdea('twist')}
                            className="p-4 bg-white border border-slate-200 rounded-xl hover:border-purple-300 hover:shadow-md text-left transition-all disabled:opacity-50 group"
                          >
                              {isAiLoading ? (
                                  <div className="flex justify-center py-2"><Loader2 className="w-6 h-6 animate-spin text-purple-500"/></div>
                              ) : (
                                  <>
                                    <div className="font-bold text-sm text-slate-800 mb-1 group-hover:text-purple-700">Plot Twist</div>
                                    <div className="text-[10px] text-slate-500">Surprise your readers</div>
                                  </>
                              )}
                          </button>
                          <button 
                             disabled={isAiLoading}
                             onClick={() => handleGenerateIdea('rewrite')}
                             className="p-4 bg-white border border-slate-200 rounded-xl hover:border-purple-300 hover:shadow-md text-left transition-all disabled:opacity-50 group"
                          >
                              {isAiLoading ? (
                                  <div className="flex justify-center py-2"><Loader2 className="w-6 h-6 animate-spin text-purple-500"/></div>
                              ) : (
                                  <>
                                    <div className="font-bold text-sm text-slate-800 mb-1 group-hover:text-purple-700">Rewrite</div>
                                    <div className="text-[10px] text-slate-500">Polish tone & style</div>
                                  </>
                              )}
                          </button>
                      </div>
                  </div>

                  {/* Moderation */}
                  <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Safety Check</h4>
                      <button 
                        onClick={handleModeration}
                        disabled={isAiLoading}
                        className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50 shadow-sm"
                      >
                          <span className="text-sm font-bold text-slate-700">Check Content</span>
                          {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <AlertTriangle className="w-4 h-4 text-slate-400" />}
                      </button>
                      
                      {moderationResult === 'approved' && (
                          <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700 text-sm font-medium">
                              <div className="bg-green-200 p-1 rounded-full"><CheckCircle2 className="w-4 h-4" /></div> Content Safe
                          </div>
                      )}
                      {moderationResult === 'flagged' && (
                          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm font-medium">
                              <div className="bg-red-200 p-1 rounded-full"><XCircle className="w-4 h-4" /></div> Issues Found
                          </div>
                      )}
                  </div>

                  {/* AI Output Area */}
                  {aiSuggestion && (
                      <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 animate-fade-in-up shadow-sm">
                          <div className="flex justify-between items-center mb-3">
                              <span className="text-xs font-bold text-purple-700 uppercase">Suggestion</span>
                              <button onClick={() => setAiSuggestion('')} className="text-xs text-slate-400 hover:text-slate-600">Clear</button>
                          </div>
                          <p className="text-sm text-slate-700 italic mb-4 font-serif leading-relaxed">"{aiSuggestion}"</p>
                          <button 
                            onClick={() => {
                                handleContentChange(activeChapter.content + "\n" + aiSuggestion);
                                setAiSuggestion('');
                            }}
                            className="w-full py-2 bg-white text-purple-700 text-xs font-bold rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
                          >
                              Insert Text
                          </button>
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};
