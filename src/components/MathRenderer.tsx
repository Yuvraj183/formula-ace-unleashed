
import { useEffect, useRef } from "react";

interface MathRendererProps {
  text: string;
}

const MathRenderer = ({ text }: MathRendererProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Load KaTeX if not already loaded
    if (!window.katex) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
      document.head.appendChild(link);
      
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js';
      script.async = true;
      script.onload = () => {
        renderMath();
      };
      document.body.appendChild(script);
    } else {
      renderMath();
    }
  }, [text]);
  
  const renderMath = () => {
    if (!containerRef.current || !window.katex) return;
    
    // Split the text by math delimiters and render each part
    const container = containerRef.current;
    container.innerHTML = '';
    
    // Split by $$ (display math)
    const displayMathRegex = /\$\$(.*?)\$\$/g;
    const withDisplayMath = text.split(displayMathRegex);
    
    withDisplayMath.forEach((part, index) => {
      // If even index, it's text which may contain inline math
      if (index % 2 === 0) {
        // Split by $ (inline math)
        const inlineMathRegex = /\$(.*?)\$/g;
        const withInlineMath = part.split(inlineMathRegex);
        
        withInlineMath.forEach((textPart, i) => {
          if (i % 2 === 0) {
            // Regular text, just add it
            const textNode = document.createElement('div');
            textNode.className = 'whitespace-pre-wrap';
            textNode.innerHTML = textPart.split('\n').join('<br/>');
            container.appendChild(textNode);
          } else {
            // Inline math, render with KaTeX
            const mathEl = document.createElement('span');
            try {
              window.katex.render(textPart, mathEl, {
                throwOnError: false,
                displayMode: false
              });
            } catch (err) {
              mathEl.textContent = `$${textPart}$`;
            }
            container.appendChild(mathEl);
          }
        });
      } else {
        // Display math, render with KaTeX
        const mathEl = document.createElement('div');
        mathEl.className = 'flex justify-center py-2';
        try {
          window.katex.render(part, mathEl, {
            throwOnError: false,
            displayMode: true
          });
        } catch (err) {
          mathEl.textContent = `$$${part}$$`;
        }
        container.appendChild(mathEl);
      }
    });
  };
  
  return <div ref={containerRef} className="math-renderer"></div>;
};

export default MathRenderer;
