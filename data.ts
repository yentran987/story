import { Story, Chapter } from './types';

const GENRES = ['Sci-Fi', 'Romance', 'Mystery', 'Horror'];
const TITLES_PREFIX = ['The', 'A', 'Lost', 'Eternal', 'Dark', 'Silent', 'Broken', 'Hidden', 'Last', 'First'];
const TITLES_NOUN = ['Star', 'Heart', 'Code', 'Shadow', 'Empire', 'Memory', 'Echo', 'Void', 'Prophecy', 'Secret', 'Labyrinth', 'Signal'];
const AUTHORS = ['Elara Vance', 'Jaxon Cole', 'Sarah Jenkins', 'Mike T.', 'A. R. Winter', 'Elena Vance', 'Marcus Thorne'];

// Helper to generate random text
const generateContent = (genre: string, chapterNum: number) => {
  const intro = `Chapter ${chapterNum} begins with a sudden realization. `;
  const middle = `The atmosphere was heavy with ${genre === 'Horror' ? 'dread' : genre === 'Romance' ? 'longing' : 'mystery'}. `;
  const action = `They knew they couldn't turn back now. The ${genre === 'Sci-Fi' ? 'system' : 'shadow'} was closing in. `;
  const filler = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ";
  return intro + middle + action + filler.repeat(10);
};

const generateChapters = (count: number, genre: string): Chapter[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `ch-${i + 1}`,
    title: `Chapter ${i + 1}: ${['The Beginning', 'The Conflict', 'The Twist', 'The Journey', 'The Revelation'][i % 5]}`,
    content: generateContent(genre, i + 1)
  }));
};

const generateStories = (): Story[] => {
  const stories: Story[] = [];
  
  for (let i = 1; i <= 50; i++) {
    const genre = GENRES[Math.floor(Math.random() * GENRES.length)];
    const title = `${TITLES_PREFIX[Math.floor(Math.random() * TITLES_PREFIX.length)]} ${TITLES_NOUN[Math.floor(Math.random() * TITLES_NOUN.length)]}`;
    const chapterCount = Math.floor(Math.random() * 10) + 3; // 3 to 12 chapters
    
    // Generate distinct hashtags based on genre
    let tags: string[] = [];
    if (genre === 'Sci-Fi') tags = ['Space', 'Cyberpunk', 'AI', 'Dystopia', 'Aliens'];
    if (genre === 'Romance') tags = ['Drama', 'Love', 'Slice of Life', 'Contemporary', 'Slow Burn'];
    if (genre === 'Mystery') tags = ['Detective', 'Thriller', 'Crime', 'Noir', 'Suspense'];
    if (genre === 'Horror') tags = ['Supernatural', 'Gore', 'Psychological', 'Ghosts', 'Survival'];
    
    // Shuffle and pick 3 random tags
    const storyTags = tags.sort(() => 0.5 - Math.random()).slice(0, 3);

    stories.push({
      id: i.toString(),
      title: title,
      author: AUTHORS[Math.floor(Math.random() * AUTHORS.length)],
      coverUrl: `https://picsum.photos/300/450?random=${i}`,
      genre: genre,
      tags: storyTags,
      summary: `A gripping ${genre} story about ${storyTags[0].toLowerCase()} and ${storyTags[1].toLowerCase()}. Join the protagonist as they navigate through challenges in a world defined by ${storyTags[2].toLowerCase()}.`,
      rating: Number((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
      views: Math.floor(Math.random() * 50000) + 1000,
      chapters: generateChapters(chapterCount, genre),
      completed: Math.random() > 0.5
    });
  }
  return stories;
};

export const MOCK_STORIES = generateStories();
