import React from "react";
import ReactMarkdown, { Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { xonokai } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";
import gfm from "remark-gfm";

interface MarkdownViewerProps {
  markdown: string;
  className?: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({
  markdown,
  className = "",
}) => {
  // Define properly typed components
  const components: Components = {
    // eslint-disable-next-line
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline ? (
        match ? (
          <SyntaxHighlighter
            style={xonokai}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        ) : (
          <pre className={className} {...props}>
            {children}
          </pre>
        )
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold my-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-bold my-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-bold my-2">{children}</h3>
    ),
    p: ({ children }) => <p className="my-2">{children}</p>,
    ul: ({ children }) => <ul className="list-disc ml-6 my-2">{children}</ul>,
    ol: ({ children }) => (
      <ol className="list-decimal ml-6 my-2">{children}</ol>
    ),
    li: ({ children }) => <li className="my-1">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic">
        {children}
      </blockquote>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full divide-y divide-gray-200">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
    tr: ({ children }) => <tr className="even:bg-gray-50">{children}</tr>,
    th: ({ children }) => (
      <th
        scope="col"
        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
      >
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-6 py-4 whitespace-nowrap">{children}</td>
    ),
  };

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[gfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;
