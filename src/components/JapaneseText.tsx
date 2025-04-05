import React from 'react';

interface JapaneseTextProps {
  text: string;
}

const JapaneseText: React.FC<JapaneseTextProps> = ({ text }) => {
  // Split the text by the bold pattern and map each part
  const parts = text.split(/(\*\*+[^*]+\*\*+)/g);
  return (
    <div>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const boldText = part.substring(2, part.length - 2);
          return <b key={index}>{boldText}</b>;
        }
        return <>{part}</>;
      })}
    </div>
  );
};

export default JapaneseText;
