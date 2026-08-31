import React, { memo, useEffect, useMemo, useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

interface LatexViewProps {
  latex: string;
  fontSize?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

const LatexView = memo(
  ({ latex, fontSize = 16, color = '#111111', style }: LatexViewProps) => {
    const [height, setHeight] = useState(Math.max(fontSize * 2.5, 40));

    useEffect(() => {
      setHeight(Math.max(fontSize * 2.5, 40));
    }, [latex, fontSize]);

    const html = useMemo(() => {
      const rawText = latex || '';

      return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css" />
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/contrib/auto-render.min.js"></script>
  
  <style>
    * {
      box-sizing: border-box;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: transparent;
      width: 100%;
    }
    body {
      color: ${color};
      font-size: ${fontSize}px;
      line-height: 1.6; /* Increased line-height for vertical breathability */
      word-wrap: break-word;
      overflow-wrap: break-word;
      letter-spacing: 0.2px; /* Improves general text readability */
      padding: 4px 0;
    }
    #content {
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    /* --- LATEX SPACING FIXES --- */

    /* Add horizontal spacing around inline math elements */
    .katex {
      font-size: ${fontSize}px;
      margin: 0 3px; /* Prevents text and math from sticking horizontally */
      display: inline-block;
    }

    /* Block display equations spacing */
    .katex-display {
      margin: 12px 0 !important;
      padding: 6px 0 !important;
      overflow-x: auto;
      overflow-y: hidden;
      display: block;
    }

    /* Add breathing room between operators (+, =, -, etc.) inside KaTeX */
    .katex .mbin, 
    .katex .mrel {
      padding: 0 0.25em !important;
    }

    /* Prevent tight stacking on multi-line expressions */
    .katex .line {
      padding: 2px 0;
    }
  </style>
</head>
<body>
  <div id="content"></div>

  <script>
    function notifyHeight() {
      var contentEl = document.getElementById('content');
      var measuredHeight = Math.max(
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        contentEl ? contentEl.scrollHeight : 0
      );
      if (measuredHeight > 0) {
        window.ReactNativeWebView.postMessage(String(Math.ceil(measuredHeight + 10)));
      }
    }

    function renderContent() {
      var contentEl = document.getElementById('content');
      var sourceText = ${JSON.stringify(rawText)};

      if (!sourceText) {
        contentEl.innerHTML = '';
        notifyHeight();
        return;
      }

      contentEl.innerHTML = sourceText;

      if (typeof renderMathInElement === 'function') {
        try {
          renderMathInElement(contentEl, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false },
              { left: '\\\\(', right: '\\\\)', display: false },
              { left: '\\\\[', right: '\\\\]', display: true }
            ],
            throwOnError: false
          });
        } catch (e) {
          contentEl.textContent = sourceText;
        }
      } else if (typeof katex !== 'undefined') {
        try {
          katex.render(sourceText, contentEl, {
            throwOnError: false,
            displayMode: true
          });
        } catch (e) {
          contentEl.textContent = sourceText;
        }
      }

      notifyHeight();
    }

    document.addEventListener('DOMContentLoaded', function() {
      renderContent();

      if (typeof ResizeObserver !== 'undefined') {
        var ro = new ResizeObserver(function() {
          notifyHeight();
        });
        ro.observe(document.body);
      }
    });

    window.onload = renderContent;
  </script>
</body>
</html>
      `;
    }, [latex, fontSize, color]);

    const handleMessage = (event: WebViewMessageEvent) => {
      const newHeight = Number(event.nativeEvent.data);
      if (!Number.isFinite(newHeight) || newHeight <= 0) return;

      setHeight(prevHeight => {
        if (Math.abs(prevHeight - newHeight) < 2) return prevHeight;
        return newHeight;
      });
    };

    return (
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        javaScriptEnabled={true}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        automaticallyAdjustContentInsets={false}
        onMessage={handleMessage}
        style={[
          {
            width: '100%',
            height,
            backgroundColor: 'transparent',
          },
          style,
        ]}
      />
    );
  },
);

LatexView.displayName = 'LatexView';

export default LatexView;
