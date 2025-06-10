import { transformCode } from '@/utils/codeTransform';
import { FC, useEffect, useRef, useState } from 'react';
import { LoadingState } from '@components/common/LoadingState';

export const ComponentPreview: FC<{ code: string | null; isLoading?: boolean }> = ({ code, isLoading = false }) => {
  const iframe = useRef<HTMLIFrameElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!iframe.current || isLoading) return;

    if (!code || code === '') {
      setError('No code to preview');
      return;
    }

    const transformedCode = transformCode(code);

    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
          <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { 
              background: #fff; 
              margin: 0; 
              font-family: system-ui, -apple-system, sans-serif;
            }
          </style>
        </head>
        <body>
          <div id="root" style="padding: 16px;"></div>
          <script type="text/javascript">${transformedCode || ''}</script>
          <script type="text/javascript">
            ReactDOM.render(React.createElement(MyComponent), document.getElementById('root'));
          </script>
        </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    iframe.current.src = url;

    return () => {
      URL.revokeObjectURL(url);
    }
  }, [code, isLoading]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="flex-1 min-h-0 pr-2">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <LoadingState color="bg-primary-200" />
          </div>
        ) : (
          <div className="h-full overflow-auto scrollbar-thin scrollbar-thumb-primary-200 scrollbar-track-transparent hover:scrollbar-thumb-primary-200">
            <iframe
              title="preview"
              ref={iframe}
              sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
              width="100%"
              height="100%"
              className="min-h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

