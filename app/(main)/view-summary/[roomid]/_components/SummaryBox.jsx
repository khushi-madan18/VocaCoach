import React from 'react'
import ReactMarkdown from 'react-markdown';

function SummaryBox({ summary }) {
  return (
    <div className="h-[60vh] overflow-auto">
      <div className="text-base leading-8">
        <ReactMarkdown>
          {summary}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default SummaryBox;
