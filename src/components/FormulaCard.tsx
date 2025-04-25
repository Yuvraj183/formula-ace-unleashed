
import { useEffect, useRef } from "react";
import { Formula } from "@/lib/data";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

declare global {
  interface Window {
    katex: any;
  }
}

interface FormulaCardProps {
  formula: Formula;
}

const FormulaCard = ({ formula }: FormulaCardProps) => {
  const formulaRef = useRef<HTMLDivElement>(null);
  
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
      script.onload = renderFormula;
      document.body.appendChild(script);
    } else {
      renderFormula();
    }
  }, [formula.latex]);
  
  const renderFormula = () => {
    if (window.katex && formulaRef.current) {
      window.katex.render(formula.latex, formulaRef.current, {
        throwOnError: false,
        displayMode: true
      });
    }
  };
  
  return (
    <div className="formula-card mb-4">
      <CardTitle className="text-lg font-medium mb-2">{formula.title}</CardTitle>
      <div 
        ref={formulaRef} 
        className="py-3 px-5 bg-gray-50 rounded-md overflow-x-auto min-h-[60px] flex items-center justify-center"
      ></div>
      <div className="mt-3">
        <h4 className="font-medium text-sm text-gray-700">Explanation:</h4>
        <p className="text-gray-600 text-sm mt-1">{formula.explanation}</p>
      </div>
      <div className="mt-2">
        <h4 className="font-medium text-sm text-gray-700">Where it's used:</h4>
        <p className="text-gray-600 text-sm mt-1">{formula.where}</p>
      </div>
    </div>
  );
};

export default FormulaCard;
