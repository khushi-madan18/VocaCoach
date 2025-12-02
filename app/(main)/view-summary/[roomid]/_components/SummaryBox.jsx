// import React from 'react'
// import ReactMarkdown from 'react-markdown';

// function SummaryBox({ summary }) {
//   return (
//     <div className="h-[60vh] overflow-auto">
//       <div className="text-base leading-8">
//         <ReactMarkdown>
//           {summary}
//         </ReactMarkdown>
//       </div>
//     </div>
//   );
// }

// export default SummaryBox;
import React from 'react'
import ReactMarkdown from 'react-markdown';

function SummaryBox({ summary }) {
  let content = "Generating summary...";
  

  if (typeof summary === 'string') {
    content = summary;
  } 
 
  else if (summary && typeof summary === 'object' && summary.content) {
    content = summary.content;
  }
  // Case 3: It's a real error or unknown object
  else if (summary && typeof summary === 'object') {
    content = "Error: " + (summary.message || JSON.stringify(summary));
  }

  return (
    <div className="h-[60vh] overflow-auto p-4">
      <div className="text-base leading-8 prose prose-slate max-w-none">
        <ReactMarkdown>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default SummaryBox;