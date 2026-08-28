import React, { useEffect, useState, useRef } from 'react';

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
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
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
          if (isMounted) setIsLoading(false);
        } catch (e) {
          console.debug('Disqus reset notice:', e);
        }
      } else {
        const scriptId = 'disqus-embed-script';
        const existingScript = document.getElementById(scriptId);
        
        if (!existingScript) {
          const s = document.createElement('script');
          s.id = scriptId;
          s.src = 'https://educuarte.disqus.com/embed.js';
          s.setAttribute('data-timestamp', String(+new Date()));
          s.async = true;
          s.crossOrigin = 'anonymous';
          s.onload = () => {
            if (isMounted) setIsLoading(false);
          };
          s.onerror = () => {
            if (isMounted) {
              setIsLoading(false);
              setHasError(true);
            }
          };
          (document.head || document.body).appendChild(s);
        } else {
          if (isMounted) setIsLoading(false);
        }
      }
    } catch (err) {
      console.debug('Disqus init notice:', err);
      if (isMounted) {
        setIsLoading(false);
        setHasError(true);
      }
    }

    const timer = setTimeout(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [pageIdentifier, pageTitle, pageUrl]);

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg text-slate-800 relative transition-all">
      {/* Disqus Target Container */}
      <div id="disqus_thread" ref={threadRef} className="min-h-[220px] relative z-10" />

      {/* Loading Indicator */}
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
            <p className="font-semibold mb-0.5">Disqus comments unavailable in this preview sandbox</p>
            <p className="text-amber-800">
              Third-party cookies or scripts are restricted in iframe mode. You can view comments directly at{' '}
              <a href="https://educurate-vy74.vercel.app/" target="_blank" rel="noreferrer" className="underline font-semibold">
                educurate-vy74.vercel.app
              </a>.
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



