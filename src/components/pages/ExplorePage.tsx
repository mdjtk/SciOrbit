'use client';
import { Search, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getPosts } from '@/utils/api';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/animations';
import Link from '@/components/Link';

export default function ExplorePage() {
  const categories = ["Astronomy", "Biology", "Physics", "Chemistry", "Technology", "Space", "Geology", "Neuroscience"];
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getPosts();
      setItems(data);
      setLoading(false);
    }
    load();
  }, []);

  const trendingTopics = [
    { tag: "#JamesWebb", posts: "12.4k" },
    { tag: "#DNAEditing", posts: "8.2k" },
    { tag: "#BlackHoles", posts: "6.9k" },
    { tag: "#QuantumComputing", posts: "5.1k" },
    { tag: "#CRISPR", posts: "4.8k" },
  ];

  const filteredItems = items.filter(o => {
    const matchesCategory = !activeCategory || o.category === activeCategory;
    const matchesSearch = !searchQuery || o.title.toLowerCase().includes(searchQuery.toLowerCase()) || o.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-12 max-w-7xl mx-auto w-full">
      {/* ─── Search Header ─── */}
      <ScrollReveal>
        <section className="flex flex-col gap-8 items-center pt-8">
          <div className="relative group max-w-2xl mx-auto w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
            <motion.input 
              type="text" 
              placeholder="Search for space, cells, or discoveries..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/80 backdrop-blur-sm border-2 border-border/80 rounded-2xl pl-14 pr-6 py-4 text-lg input-focus shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              whileFocus={{ scale: 1.02 }}
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            {categories.map((cat, i) => (
              <motion.button 
                key={cat} 
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium shadow-sm transition-all border ${
                  activeCategory === cat 
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                    : 'bg-white border-border hover:border-primary/50 hover:text-primary hover:bg-primary/5'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ─── Trending ─── */}
      <ScrollReveal delay={0.1}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 px-2">
            <Sparkles size={18} className="text-secondary" />
            <h2 className="font-display font-bold text-lg text-primary">Trending Research</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {trendingTopics.map((topic, i) => (
              <motion.div
                key={topic.tag}
                className="snap-start flex-shrink-0 flex items-center gap-3 px-6 py-4 glass-card rounded-2xl cursor-pointer shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all border border-border"
                whileHover={{ scale: 1.05, y: -4 }}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <TrendingUp size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-primary">{topic.tag}</span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{topic.posts} POSTS</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* ─── Explore Grid ─── */}
      <div className="flex flex-col gap-4">
        <h2 className="font-display font-bold text-xl text-primary px-2">Discoveries for you</h2>
        {loading ? (
          <div className="flex justify-center py-20 text-muted-foreground animate-pulse">Loading discoveries...</div>
        ) : (
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 px-2 pb-12">
            {filteredItems.map((item, i) => (
              <StaggerItem key={item.id}>
                <Link href={`/post/${item.id}`}>
                  <motion.div 
                    className="group relative rounded-2xl overflow-hidden aspect-square border border-border/60 cursor-pointer shadow-sm transition-all"
                    whileHover={{ y: -8, boxShadow: '0 20px 40px -15px rgba(12,49,103,0.15)' }}
                  >
                    <div className={`w-full h-full bg-gradient-to-br ${
                      i % 3 === 0 ? 'from-primary/10 to-indigo-500/10' : 
                      i % 3 === 1 ? 'from-accent/10 to-amber-500/10' : 
                      'from-secondary/10 to-emerald-500/10'
                    } group-hover:scale-110 transition-transform duration-700 bg-cover bg-center`}
                      style={item.media ? { backgroundImage: `url(${item.media})` } : {}}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent flex flex-col justify-end p-5">
                      <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <h3 className="text-white text-lg font-bold leading-tight mb-1 group-hover:text-amber-200 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-white/80 text-xs font-medium line-clamp-1">{item.description || 'Click to explore detailed research →'}</p>
                      </motion.div>
                    </div>
                  </motion.div>
                </Link>
              </StaggerItem>
            ))}
            {filteredItems.length === 0 && (
              <div className="col-span-full py-20 text-center text-muted-foreground border border-dashed border-border rounded-3xl">
                No discoveries found.
              </div>
            )}
          </StaggerContainer>
        )}
      </div>
    </div>
  );
}
