
import React, { useState, useEffect } from 'react';
import { View, LandingPageContent } from '../types';
import { Save, LogOut, Layout, BarChart3, TrendingUp, Star, Type, Image as ImageIcon, Palette, Home } from 'lucide-react';

interface CMSProps {
  initialContent: LandingPageContent;
  onSave: (content: LandingPageContent) => void;
  onExit: () => void;
}

export const CMS: React.FC<CMSProps> = ({ initialContent, onSave, onExit }) => {
  const [content, setContent] = useState<LandingPageContent>(initialContent);
  const [activeTab, setActiveTab] = useState<keyof LandingPageContent>('hero');

  // Ensure state syncs if props change (though unlikely in this flow)
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleChange = (section: keyof LandingPageContent, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    onSave(content);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <Palette className="w-4 h-4"/> },
    { id: 'hero', label: 'Hero Section', icon: <Layout className="w-4 h-4"/> },
    { id: 'stats', label: 'Stats', icon: <BarChart3 className="w-4 h-4"/> },
    { id: 'trending', label: 'Trending', icon: <TrendingUp className="w-4 h-4"/> },
    { id: 'features', label: 'Features', icon: <Star className="w-4 h-4"/> },
    { id: 'cta', label: 'CTA', icon: <Type className="w-4 h-4"/> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* CMS Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2 rounded-lg">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Content Manager</h1>
            <p className="text-xs text-slate-500">Edit Landing Page</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onExit}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" /> Back to Home
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md transition-colors"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full p-6 gap-8">
        
        {/* Sidebar Tabs */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as keyof LandingPageContent)}
                className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium text-left transition-colors border-l-4 ${
                  activeTab === tab.id 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900' 
                    : 'border-transparent text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Edit Form */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          
          {activeTab === 'general' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-lg font-bold text-slate-800 border-b pb-4 mb-6">General Settings</h2>
              <InputGroup label="Logo Text" value={content.general.logoText} onChange={(v) => handleChange('general', 'logoText', v)} />
              <div className="grid grid-cols-2 gap-6">
                 {/* Simplified color logic: just editing text for now as tailwind config handles actual palettes */}
                 <InputGroup label="Primary Color Name" value={content.general.primaryColor} onChange={(v) => handleChange('general', 'primaryColor', v)} help="Reference for theme (e.g. indigo, purple)" />
                 <InputGroup label="Secondary Color Name" value={content.general.secondaryColor} onChange={(v) => handleChange('general', 'secondaryColor', v)} />
              </div>
            </div>
          )}

          {activeTab === 'hero' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-lg font-bold text-slate-800 border-b pb-4 mb-6">Hero Section</h2>
              <InputGroup label="Background Image URL" value={content.hero.backgroundImage} onChange={(v) => handleChange('hero', 'backgroundImage', v)} icon={<ImageIcon className="w-4 h-4"/>} />
              <InputGroup label="Badge Text" value={content.hero.badgeText} onChange={(v) => handleChange('hero', 'badgeText', v)} />
              <div className="grid grid-cols-2 gap-6">
                <InputGroup label="Headline Start" value={content.hero.headlineStart} onChange={(v) => handleChange('hero', 'headlineStart', v)} />
                <InputGroup label="Headline Highlight" value={content.hero.headlineHighlight} onChange={(v) => handleChange('hero', 'headlineHighlight', v)} />
              </div>
              <InputGroup label="Subheadline" value={content.hero.subheadline} onChange={(v) => handleChange('hero', 'subheadline', v)} isTextArea />
              <div className="grid grid-cols-2 gap-6">
                <InputGroup label="Primary Button Text" value={content.hero.buttonRead} onChange={(v) => handleChange('hero', 'buttonRead', v)} />
                <InputGroup label="Secondary Button Text" value={content.hero.buttonWrite} onChange={(v) => handleChange('hero', 'buttonWrite', v)} />
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-lg font-bold text-slate-800 border-b pb-4 mb-6">Statistics Bar</h2>
              <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg">
                <InputGroup label="Stat 1 Label" value={content.stats.label1} onChange={(v) => handleChange('stats', 'label1', v)} />
                <InputGroup label="Stat 1 Value" value={content.stats.value1} onChange={(v) => handleChange('stats', 'value1', v)} />
              </div>
              <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg">
                <InputGroup label="Stat 2 Label" value={content.stats.label2} onChange={(v) => handleChange('stats', 'label2', v)} />
                <InputGroup label="Stat 2 Value" value={content.stats.value2} onChange={(v) => handleChange('stats', 'value2', v)} />
              </div>
              <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg">
                <InputGroup label="Stat 3 Label" value={content.stats.label3} onChange={(v) => handleChange('stats', 'label3', v)} />
                <InputGroup label="Stat 3 Value" value={content.stats.value3} onChange={(v) => handleChange('stats', 'value3', v)} />
              </div>
            </div>
          )}

          {activeTab === 'trending' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-lg font-bold text-slate-800 border-b pb-4 mb-6">Trending Section</h2>
              <InputGroup label="Section Title" value={content.trending.title} onChange={(v) => handleChange('trending', 'title', v)} />
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                Note: The actual story cards are generated dynamically from the application's database and cannot be edited here.
              </p>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-lg font-bold text-slate-800 border-b pb-4 mb-6">Features Section</h2>
              <InputGroup label="Section Title" value={content.features.title} onChange={(v) => handleChange('features', 'title', v)} />
              <InputGroup label="Subtitle" value={content.features.subtitle} onChange={(v) => handleChange('features', 'subtitle', v)} />
              
              <div className="space-y-4 mt-6">
                <h3 className="font-bold text-slate-700">Feature 1</h3>
                <InputGroup label="Title" value={content.features.item1Title} onChange={(v) => handleChange('features', 'item1Title', v)} />
                <InputGroup label="Description" value={content.features.item1Desc} onChange={(v) => handleChange('features', 'item1Desc', v)} isTextArea />
              </div>
              
              <div className="space-y-4 mt-6 pt-6 border-t">
                <h3 className="font-bold text-slate-700">Feature 2</h3>
                <InputGroup label="Title" value={content.features.item2Title} onChange={(v) => handleChange('features', 'item2Title', v)} />
                <InputGroup label="Description" value={content.features.item2Desc} onChange={(v) => handleChange('features', 'item2Desc', v)} isTextArea />
              </div>

              <div className="space-y-4 mt-6 pt-6 border-t">
                <h3 className="font-bold text-slate-700">Feature 3</h3>
                <InputGroup label="Title" value={content.features.item3Title} onChange={(v) => handleChange('features', 'item3Title', v)} />
                <InputGroup label="Description" value={content.features.item3Desc} onChange={(v) => handleChange('features', 'item3Desc', v)} isTextArea />
              </div>
            </div>
          )}

          {activeTab === 'cta' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-lg font-bold text-slate-800 border-b pb-4 mb-6">Call to Action</h2>
              <InputGroup label="Background Pattern URL" value={content.cta.backgroundImage} onChange={(v) => handleChange('cta', 'backgroundImage', v)} icon={<ImageIcon className="w-4 h-4"/>} />
              <InputGroup label="Title" value={content.cta.title} onChange={(v) => handleChange('cta', 'title', v)} />
              <InputGroup label="Description" value={content.cta.description} onChange={(v) => handleChange('cta', 'description', v)} isTextArea />
              <InputGroup label="Button Text" value={content.cta.buttonText} onChange={(v) => handleChange('cta', 'buttonText', v)} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// Helper Component for Inputs
const InputGroup = ({ label, value, onChange, isTextArea = false, icon, help }: { label: string, value: string, onChange: (v: string) => void, isTextArea?: boolean, icon?: React.ReactNode, help?: string }) => (
  <div className="w-full">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
      {icon} {label}
    </label>
    {isTextArea ? (
      <textarea 
        className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm min-h-[100px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <input 
        type="text"
        className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    )}
    {help && <p className="text-xs text-slate-400 mt-1">{help}</p>}
  </div>
);
