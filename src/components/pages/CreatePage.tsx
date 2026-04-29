'use client';
import { Image as ImageIcon, Video, Send, X, Hash, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';

export default function CreatePostPage() {
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    // Simulate file addition
    setFiles(prev => [...prev, `discovery_${prev.length + 1}.jpg`]);
  };

  const addTag = () => {
    const clean = tagInput.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags(prev => [...prev, clean]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setDescription('');
        setTags([]);
        setFiles([]);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto relative mt-2 w-full">
      {/* ─── Success Toast ─── */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            className="fixed top-28 left-1/2 -translate-x-1/2 z-50 glass px-8 py-4 rounded-3xl shadow-[0_20px_60px_-15px_rgba(34,197,94,0.3)] border border-green-500/20 flex items-center gap-3"
          >
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-inner"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 500 }}
            >
              ✓
            </motion.div>
            <span className="font-display font-bold text-lg text-primary">Discovery shared successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="bg-white/80 backdrop-blur-xl border border-border/80 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* ─── Upload Area ─── */}
        <div 
          className={`flex-1 min-h-[500px] flex flex-col items-center justify-center p-12 transition-all duration-300 cursor-pointer relative overflow-hidden ${
            dragActive 
              ? 'bg-primary/[0.03] border-4 border-dashed border-primary/40 rounded-[2.5rem] m-2' 
              : 'bg-muted/30 border-r border-border hover:bg-muted/50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <input type="file" ref={fileRef} className="hidden" accept="image/*,video/*" onChange={() => setFiles(prev => [...prev, `upload_${prev.length + 1}.jpg`])} />
          
          {files.length === 0 ? (
            <>
              <motion.div 
                className="w-28 h-28 rounded-[2rem] bg-white shadow-xl shadow-primary/5 flex items-center justify-center mb-8 border border-border/50"
                animate={{ y: dragActive ? -10 : 0, scale: dragActive ? 1.05 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <ImageIcon size={44} className="text-secondary" />
              </motion.div>
              <motion.h2 
                className="text-2xl font-display font-black italic text-primary mb-3"
                animate={{ scale: dragActive ? 1.05 : 1 }}
              >
                {dragActive ? 'Drop your files here!' : 'Add your media'}
              </motion.h2>
              <p className="text-muted-foreground text-center max-w-[280px] mb-8 leading-relaxed">Share your discoveries, research findings, or visual art with the Science Orbit community.</p>
              <motion.button 
                className="px-8 py-3.5 bg-gradient-to-r from-secondary to-blue-600 text-white rounded-full font-bold shadow-lg shadow-secondary/20 hover:shadow-secondary/40 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
              >
                Select From Device
              </motion.button>
            </>
          ) : (
            <div className="w-full grid grid-cols-2 gap-4 p-4">
              {files.map((file, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative aspect-square rounded-[2rem] bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center overflow-hidden group border border-border"
                >
                  <ImageIcon size={32} className="text-primary/30" />
                  <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setFiles(prev => prev.filter((_, idx) => idx !== i)); }}
                      className="p-3 bg-white rounded-full shadow-2xl hover:scale-110 transition-transform"
                    >
                      <X size={20} className="text-red-500" />
                    </button>
                  </div>
                  <span className="absolute bottom-3 left-4 text-[10px] font-bold text-white bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-md">{file}</span>
                </motion.div>
              ))}
              <motion.div 
                className="aspect-square rounded-[2rem] border-2 border-dashed border-border/80 flex items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary"
                whileHover={{ scale: 1.03 }}
              >
                <span className="text-4xl">+</span>
              </motion.div>
            </div>
          )}
        </div>

        {/* ─── Details Side ─── */}
        <div className="w-full md:w-[460px] flex flex-col p-10 gap-8 bg-white/50">
          <div className="flex items-center gap-4 border-b border-border/60 pb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black text-sm shadow-inner tracking-widest border-2 border-white shadow-md">JD</div>
            <div className="flex flex-col">
              <p className="font-bold text-primary">@science_pro_user</p>
              <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Posting to Science Orbit</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are your latest findings? Detail your research here..." 
              className="w-full h-40 bg-muted/40 border border-border/80 rounded-2xl p-5 text-foreground input-focus resize-none placeholder:text-muted-foreground/60 text-[15px] leading-relaxed shadow-inner"
              maxLength={2200}
            />
            <div className="flex justify-between text-[11px] font-bold text-muted-foreground px-1">
              <span>{description.length}/2,200 <span className="opacity-60 font-medium">characters</span></span>
              <span className={description.length > 2000 ? 'text-red-500' : ''}>
                {2200 - description.length} <span className="opacity-60 font-medium">remaining</span>
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tags & Categories</label>
            <div className="flex flex-wrap gap-2 min-h-[36px]">
              <AnimatePresence>
                {tags.map(tag => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-primary text-xs font-bold rounded-full shadow-sm"
                  >
                    <Hash size={12} className="opacity-60" />{tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-red-500 hover:bg-white rounded-full transition-colors ml-1"><X size={14} /></button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
            <div className="flex gap-2">
              <input 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                placeholder="Add tags... (e.g. quantum, cells)"
                className="flex-1 bg-white border border-border/80 shadow-sm rounded-2xl px-5 py-3 text-[15px] input-focus placeholder:text-muted-foreground/60"
              />
              <motion.button
                onClick={addTag}
                className="px-5 py-3 bg-white border border-border/80 shadow-sm rounded-2xl text-sm font-bold text-primary hover:border-primary hover:text-primary transition-all"
                whileTap={{ scale: 0.9 }}
              >
                <Hash size={18} />
              </motion.button>
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-border/60 flex justify-end gap-3">
            <motion.button 
              className="px-6 py-3 bg-white border border-border shadow-sm text-foreground rounded-full font-bold hover:bg-muted/50 transition-all text-[13px]"
              whileTap={{ scale: 0.95 }}
            >
              Save Draft
            </motion.button>
            <motion.button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-bold shadow-[0_8px_20px_rgba(12,49,103,0.3)] btn-glow flex items-center gap-2 disabled:opacity-50 text-[13px]"
              whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? (
                <>
                  <motion.div 
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                  Publishing
                </>
              ) : (
                <>
                  Publish Discovery <Send size={14} className="rotate-12" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
