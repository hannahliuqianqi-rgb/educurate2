import React, { useEffect, useState } from 'react';

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
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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
        setIsLoading(false);
      } catch (e) {
        console.warn('Disqus reset notice:', e);
      }
    } else {
      const scriptId = 'disqus-embed-script';
      const existingScript = document.getElementById(scriptId);
      
      if (!existingScript) {
        const d = document;
        const s = d.createElement('script');
        s.id = scriptId;
        s.src = 'https://educuarte.disqus.com/embed.js';
        s.setAttribute('data-timestamp', String(+new Date()));
        s.async = true;
        s.onload = () => setIsLoading(false);
        s.onerror = () => {
          setIsLoading(false);
          setHasError(true);
        };
        (d.head || d.body).appendChild(s);
      } else {
        setIsLoading(false);
      }
    }

    // Timer fallback in case Disqus iframe loads without script onload event
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pageIdentifier, pageTitle, pageUrl]);

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg text-slate-800 relative transition-all">
      {/* Disqus Target Container */}
      <div id="disqus_thread" className="min-h-[220px] relative z-10" />

      {/* Loading & Privacy Guard Fallback Indicator */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-10 text-slate-500 gap-3">
          <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-xs font-medium text-slate-600">Connecting to Disqus community discussion...</p>
        </div>
      )}

      {hasError && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 mt-4">
          <span className="material-symbols-outlined text-amber-600 text-lg flex-shrink-0">shield</span>
          <div>
            <p className="font-semibold mb-0.5">Disqus script blocked by browser privacy protection</p>
            <p className="text-amber-800">
              If you have an ad-blocker or strict tracking protection enabled (e.g. Brave Shields, uBlock), please allow <code>disqus.com</code> to participate in the comments thread.
            </p>
          </div>
        </div>
      )}

      <noscript>
        <div className="p-4 rounded-xl bg-slate-100 text-slate-700 text-xs text-center">
          Please enable JavaScript to view the{' '}
          <a href="https://disqus.com/?ref_noscript" className="text-primary font-semibold underline" rel="noreferrer" target="_blank">
            comments powered by Disqus.
          </a>
        </div>
      </noscript>
    </div>
  );
};


