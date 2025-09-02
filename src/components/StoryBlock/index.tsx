import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// 创建一个 Wrapper 来为所有 Markdown 生成的 HTML 元素提供统一样式
const MarkdownWrapper = styled.div`
  animation: ${fadeIn} 0.8s ease-out;
  font-size: 1.1rem;
  line-height: 1.7;
  color: #c0c0c0;
  margin-bottom: 2rem;
  white-space: pre-wrap; // 保持换行

  p {
    margin-bottom: 1rem;
  }

  h1, h2, h3 {
    color: #00ffff; // 标题使用赛博朋克风格的青色
    border-bottom: 1px solid #333;
    padding-bottom: 0.3em;
    margin-top: 1.5em;
    margin-bottom: 1em;
  }

  ul, ol {
    padding-left: 2rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  blockquote {
    border-left: 4px solid #00ffff;
    padding-left: 1rem;
    margin-left: 0;
    color: #888;
    font-style: italic;
  }

  code {
    background: #222;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: 'Share Tech Mono', monospace;
  }

  strong {
    color: #fff;
  }
`;

interface StoryBlockProps {
  text: string;
}

const StoryBlock = ({ text }: StoryBlockProps) => {
  return (
    <MarkdownWrapper>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {text}
      </ReactMarkdown>
    </MarkdownWrapper>
  );
};

export default StoryBlock;