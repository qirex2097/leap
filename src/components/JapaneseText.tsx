import React from 'react';

interface JapaneseTextProps {
  text: string;
}

const JapaneseText: React.FC<JapaneseTextProps> = ({ text }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: text.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>') }} />
  );
};

export default JapaneseText;
