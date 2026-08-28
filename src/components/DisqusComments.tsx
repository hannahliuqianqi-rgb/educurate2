import React, { useEffect } from 'react';

interface DisqusCommentsProps {
  pageIdentifier?: string;
  pageTitle?: string;
  pageUrl?: string;
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

export const DisqusComments: React.FC<DisqusCommentsProps> = ({
  pageIdentifier = 'PORTAL FEEDBACK AND STUDENT COMMUNITY',
  pageTitle = 'PORTAL FEEDBACK AND STUDENT COMMUNITY',
  pageUrl = 'https://educurate-vy74.vercel.app/',
}) => {
  useEffect(() => {
    const targetUrl = pageUrl || 'https://educurate-vy74.vercel.app/';
    const targetIdentifier = pageIdentifier || 'PORTAL FEEDBACK AND STUDENT COMMUNITY';

    window.disqus_config = function (this: any) {
      this.page = this.page || {};
      this.page.url = targetUrl;
      this.page.identifier = targetIdentifier;
      this.page.title = pageTitle;
    };

    if (window.DISQUS) {
      // If already loaded in SPA navigation, reset for the current page identifier
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
        console.warn('Disqus reset notice:', e);
      }
    } else {
      const scriptId = 'disqus-embed-script';
      if (!document.getElementById(scriptId)) {
        const d = document;
        const s = d.createElement('script');
        s.id = scriptId;
        s.src = 'https://educuarte.disqus.com/embed.js';
        s.setAttribute('data-timestamp', String(+new Date()));
        (d.head || d.body).appendChild(s);
      }
    }
  }, [pageIdentifier, pageTitle, pageUrl]);

  return (
    <div className="w-full bg-white/95 dark:bg-slate-900/95 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-800 dark:text-slate-100">
      <div id="disqus_thread" className="min-h-[220px]" />
      <noscript>
        Please enable JavaScript to view the{' '}
        <a href="https://disqus.com/?ref_noscript" className="text-blue-500 underline" rel="noreferrer" target="_blank">
          comments powered by Disqus.
        </a>
      </noscript>
    </div>
  );
};

