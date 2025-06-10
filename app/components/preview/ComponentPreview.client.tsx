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
          <style>body { background: #fff; margin: 0; }</style>
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
    return <div className="text-red-500 text-center p-4">{error}</div>
  }

  return (
    <div className="w-full h-full overflow-hidden border-l">
      <h2 className="text-lg p-4 border-b border-gray-300">Component preview</h2>
      {isLoading ? (
        <div className="h-[calc(100%-57px)]">
          <LoadingState fullScreen color="bg-gray-400" />
        </div>
      ) : (
        <div className="h-[calc(100%-57px)] overflow-auto">
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
  );
};

