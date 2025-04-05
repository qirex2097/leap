import React from "react";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { QuestionData, divideQuestion, getAnswers } from "../questions";
import { WrongQuestionHistory } from "./App";
import JapaneseText from "../components/JapaneseText";

const WordDetailsContainerStyle = {
  marginTop: '16px',
  padding: '12px',
  backgroundColor: 'rgba(255, 235, 235, 0.3)',
  border: '1px solid rgba(255, 0, 0, 0.1)',
  borderRadius: '4px',
};

const getPartStyle = (isHighlighted: boolean) => ({
  fontWeight: isHighlighted ? 'bold' : 'normal',
  color: isHighlighted ? '#d32f2f' : 'inherit',
  backgroundColor: isHighlighted ? 'rgba(255, 235, 235, 0.5)' : 'transparent',
  padding: isHighlighted ? '0 2px' : '0',
  borderRadius: isHighlighted ? '2px' : '0',
});
  
// ShowWrongWordsコンポーネントのプロパティの型定義
export interface ShowWrongWordsProps {
  wrongQuestionHistory: WrongQuestionHistory[];
}

// 間違えた単語を抽出する関数
const extractAllWrongWords = (wrongQuestionHistory: WrongQuestionHistory[]) => {
  if (!wrongQuestionHistory) {
    return [];
  }
  return wrongQuestionHistory.flatMap(history =>
    history.wrongQuestions.map(question => ({
      combinedWord: getAnswers(question).join(' '),
      question: question,
    }))
  );
};

// 2回以上間違えた単語をフィルタリングする関数
const filterRepeatedWrongWords = (
  allWrongWords: { combinedWord: string; question: QuestionData }[],
  wordCounts: Record<string, number>
) => {
  return allWrongWords.reduce((acc, current) => {
    const { combinedWord } = current;
    if (wordCounts[combinedWord] >= 2 && !acc.some(item => item.combinedWord === combinedWord)) {
      acc.push(current);
    }
    return acc;
  }, [] as { combinedWord: string; question: QuestionData }[]);
};

// 単語リストを表示するコンポーネント
const WordList: React.FC<{
  words: { combinedWord: string; question: QuestionData }[];
  onWordClick: (index: number) => void;
  selectedWordIndex: number | null;
}> = ({ words, onWordClick, selectedWordIndex }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
    {words.map((item, index) => (
      <Chip
        key={index}
        label={item.combinedWord}
        color="error"
        variant="outlined"
        sx={{ margin: '4px' }}
        onClick={() => onWordClick(index)}
        clickable
      />
    ))}
  </div>
);

// 選択された単語の詳細を表示するコンポーネント
const WordDetails: React.FC<{
  word: { combinedWord: string; question: QuestionData };
}> = ({ word }) => (
  <div style={WordDetailsContainerStyle}>
    <Typography variant="body2" color="text.secondary" gutterBottom>
      {word.question.sectionName}
    </Typography>
    <Typography variant="body1" gutterBottom>
      <JapaneseText text={word.question.Japanese} />
    </Typography>
    <div>
      {divideQuestion(word.question).map((part: string, partIndex: number) => (
        <span key={partIndex} style={getPartStyle(partIndex % 2 === 1)} >
          {part}
        </span>
      ))}
    </div>
  </div>
);

export const ShowWrongWords: React.FC<ShowWrongWordsProps> = ({
  wrongQuestionHistory,
}) => {
  const [selectedWordIndex, setSelectedWordIndex] = React.useState<number | null>(null);

  const allWrongWords = extractAllWrongWords(wrongQuestionHistory);

  const wordCounts = allWrongWords.reduce((counts, item) => {
    const { combinedWord } = item;
    counts[combinedWord] = (counts[combinedWord] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  const repeatedWrongWordsWithQuestions = filterRepeatedWrongWords(allWrongWords, wordCounts);

  // 単語をクリックした時のハンドラ
  const handleWordClick = (index: number) => {
    setSelectedWordIndex(prevIndex => (prevIndex === index ? null : index));
  };

  // 表示する単語がない場合は何も表示しない
  if (repeatedWrongWordsWithQuestions.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: 2 }}>
      <Typography variant="h6" component="h3" gutterBottom>
        2回以上間違えた単語一覧
      </Typography>
      <WordList
        words={repeatedWrongWordsWithQuestions}
        onWordClick={handleWordClick}
        selectedWordIndex={selectedWordIndex}
      />
      {selectedWordIndex !== null && repeatedWrongWordsWithQuestions[selectedWordIndex] && (
        <WordDetails word={repeatedWrongWordsWithQuestions[selectedWordIndex]} />
      )}
    </div>
  );
};
