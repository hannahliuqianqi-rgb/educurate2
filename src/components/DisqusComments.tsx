import React, { useEffect, useState, useRef } from 'react';

interface DisqusCommentsProps {
  pageIdentifier?: string;
  pageTitle?: string;
  pageUrl?: string;
}

interface LocalComment {
  id: string;
  author: string;
  role: string;
  avatarBg: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

declare global {
  interface Window {
    DISQUS?: {
      reset: (options: {
        reload: boolean;
        config?: () => void;
      }) => void;
    };
    disqus_config?: () => void;
  }
}

const DEFAULT_COMMENTS: Record<string, LocalComment[]> = {
  'PORTAL FEEDBACK AND STUDENT COMMUNITY': [
    {
      id: 'c1',
      author: 'Chloe Tan',
      role: 'Secondary 3 Student',
      avatarBg: 'bg-emerald-500',
      content: 'The quantum computing visualizer and astrophysics simulation were super clear! Loved how the adaptive prompts break down complex equations step by step.',
      timestamp: '2 hours ago',
      likes: 8,
    },
    {
      id: 'c2',
      author: 'Marcus Lim',
      role: 'Junior College Educator',
      avatarBg: 'bg-blue-500',
      content: 'Great initiative on cross-referencing OpenStax and MOE curriculum benchmarks. Looking forward to more Singapore Olympiad past paper walkthroughs.',
      timestamp: '5 hours ago',
      likes: 12,
    },
    {
      id: 'c3',
      author: 'Sarah Chen',
      role: 'Parent of Primary 5 Learner',
      avatarBg: 'bg-purple-500',
      content: 'The screen time insights and parent approval queue give peace of mind while my child explores junior coding quests.',
      timestamp: '1 day ago',
      likes: 5,
    }
  ]
};

export const DisqusComments: React.FC<DisqusCommentsProps> = ({
  pageIdentifier = 'PORTAL FEEDBACK AND STUDENT COMMUNITY',
  pageTitle = 'PORTAL FEEDBACK AND STUDENT COMMUNITY',
  pageUrl = 'https://educurate-vy74.vercel.app/',
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Student');
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'instant' | 'disqus'>('instant');
  const [localComments, setLocalComments] = useState<LocalComment[]>(() => {
    try {
      const saved = localStorage.getItem(`educurate_comments_${pageIdentifier}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.debug('Failed to load saved comments', e);
    }
    return DEFAULT_COMMENTS[pageIdentifier] || [
      {
        id: 'c-default',
        author: 'Community Member',
        role: 'Learner',
        avatarBg: 'bg-indigo-500',
        content: 'Excited to be part of the EduCurate learning community! Feedback and ideas welcome below.',
        timestamp: 'Just now',
        likes: 3,
      }
    ];
  });

  const threadRef = useRef<HTMLDivElement>(null);

  // Initialize and update Disqus
  useEffect(() => {
    const targetUrl = pageUrl || 'https://educurate-vy74.vercel.app/';
    const targetIdentifier = pageIdentifier || 'PORTAL FEEDBACK AND STUDENT COMMUNITY';

    try {
      window.disqus_config = function (this: any) {
        this.page = this.page || {};
        this.page.url = targetUrl;
        this.page.identifier = targetIdentifier;
        this.page.title = pageTitle;
      };

      if (window.DISQUS && typeof window.DISQUS.reset === 'function') {
        try {
          window.DISQUS.reset({
            reload: true,
            config: function (this: any) {
              this.page = this.page || {};
              this.page.url = targetUrl;
              this.page.identifier = targetIdentifier;
              this.page.title = pageTitle;
            },
          });
        } catch (e) {
          console.debug('Disqus reset notice:', e);
        }
      } else {
        const scriptId = 'disqus-embed-script';
        let existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;
        
        if (!existingScript) {
          const s = document.createElement('script');
          s.id = scriptId;
          s.src = 'https://educuarte.disqus.com/embed.js';
          s.setAttribute('data-timestamp', String(+new Date()));
          s.async = true;
          (document.head || document.body).appendChild(s);
        }
      }
    } catch (err) {
      console.debug('Disqus embedding notice:', err);
    }
  }, [pageIdentifier, pageTitle, pageUrl]);

  // Handle local comment posting
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);

    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newComment: LocalComment = {
      id: `c_${Date.now()}`,
      author: name.trim() || 'Anonymous Learner',
      role: role || 'Student',
      avatarBg: randomColor,
      content: commentText.trim(),
      timestamp: 'Just now',
      likes: 1,
      isLiked: true,
    };

    const updated = [newComment, ...localComments];
    setLocalComments(updated);
    try {
      localStorage.setItem(`educurate_comments_${pageIdentifier}`, JSON.stringify(updated));
    } catch (e) {
      console.debug('LocalStorage save notice:', e);
    }

    setCommentText('');
    setIsSubmitting(false);
  };

  const handleLike = (id: string) => {
    const updated = localComments.map((c) => {
      if (c.id === id) {
        const isLiked = !c.isLiked;
        return {
          ...c,
          isLiked,
          likes: isLiked ? c.likes + 1 : Math.max(0, c.likes - 1),
        };
      }
      return c;
    });
    setLocalComments(updated);
    try {
      localStorage.setItem(`educurate_comments_${pageIdentifier}`, JSON.stringify(updated));
    } catch (e) {
      console.debug('LocalStorage like update notice:', e);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xl text-slate-800 dark:text-slate-100 transition-all">
      {/* Header with Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">forum</span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Community Discussion &amp; Feedback</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Open to all students, parents, mentors, and educators. Leave your thoughts instantly below.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-center">
          <button
            type="button"
            onClick={() => setActiveTab('instant')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'instant'
                ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm">edit_note</span>
            Instant Public Post ({localComments.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('disqus')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'disqus'
                ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm">chat_bubble</span>
            Disqus Feed
          </button>
        </div>
      </div>

      {/* INSTANT COMMENT POSTING & FEED */}
      {activeTab === 'instant' && (
        <div className="mt-6 space-y-6">
          {/* Post Form */}
          <form onSubmit={handleSubmitComment} className="bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Name / Handle</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Tan, Coach Bryan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div className="sm:w-48">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Role / Badge</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="Student">Student (Sec / JC)</option>
                  <option value="Primary Learner">Primary Learner</option>
                  <option value="Parent / Guardian">Parent / Guardian</option>
                  <option value="Educator / Mentor">Educator / Mentor</option>
                  <option value="Curious Explorer">Curious Explorer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Message / Feedback / Question</label>
              <textarea
                rows={3}
                required
                placeholder="Share your thoughts, ask curriculum questions, or suggest new quest topics..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-emerald-500">check_circle</span>
                Instant public posting enabled — no account login required
              </span>
              <button
                type="submit"
                disabled={isSubmitting || !commentText.trim()}
                className="px-5 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                Post Comment
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3.5">
            {localComments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 shadow-sm hover:border-slate-200 dark:hover:border-slate-700 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${comment.avatarBg} text-white font-bold text-sm flex items-center justify-center shadow-sm`}>
                      {comment.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{comment.author}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                          {comment.role}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">{comment.timestamp}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleLike(comment.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                      comment.isLiked
                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {comment.isLiked ? 'favorite' : 'favorite_border'}
                    </span>
                    <span>{comment.likes}</span>
                  </button>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-12">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DISQUS EMBED THREAD */}
      <div className={`mt-6 ${activeTab === 'disqus' ? 'block' : 'hidden'}`}>
        <div id="disqus_thread" ref={threadRef} className="min-h-[260px] relative z-10" />
        <noscript>
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs text-center">
            Please enable JavaScript to view the{' '}
            <a href="https://disqus.com/?ref_noscript" className="text-primary font-semibold underline" rel="noreferrer" target="_blank">
              comments powered by Disqus.
            </a>
          </div>
        </noscript>
      </div>
    </div>
  );
};
