import React from "react";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { QuestionData, divideQuestion, getAnswers } from "../questions";
import { WrongQuestionHistory } from "./App";

// ShowWrongWordsコンポーネントのプロパティの型定義
export interface ShowWrongWordsProps {
  wrongQuestionHistory: WrongQuestionHistory[];
}

export const ShowWrongWords: React.FC<ShowWrongWordsProps> = ({
  wrongQuestionHistory,
}) => {
  // 選択された単語のインデックスを保持するstate
  const [selectedWordIndex, setSelectedWordIndex] = React.useState<number | null>(null);

  // すべての履歴から間違えた単語を抽出
  const allWrongWords = wrongQuestionHistory.flatMap(history => 
    history.wrongQuestions.map(question => {
      // 同じ問題から抽出された単語を空白で結合
      return {
        combinedWord: getAnswers(question).join(' '),
        question: question
      };
    })
  );
  
  // 単語の出現回数をカウント
  const wordCounts = allWrongWords.reduce((counts, item) => {
    const { combinedWord } = item;
    counts[combinedWord] = (counts[combinedWord] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
  
  // 2回以上間違えた単語のみをフィルタリング
  const repeatedWrongWordsWithQuestions = allWrongWords.reduce((acc, current) => {
    const { combinedWord } = current;
    // 2回以上出現し、まだ追加されていない単語のみを追加
    if (wordCounts[combinedWord] >= 2 && !acc.some(item => item.combinedWord === combinedWord)) {
      acc.push(current);
    }
    return acc;
  }, [] as { combinedWord: string, question: QuestionData }[]);
  
  // 単語をクリックした時のハンドラ
  const handleWordClick = (index: number) => {
    setSelectedWordIndex(index === selectedWordIndex ? null : index);
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
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {repeatedWrongWordsWithQuestions.map((item, index) => (
          <Chip
            key={index}
            label={item.combinedWord}
            color="error"
            variant="outlined"
            sx={{ margin: '4px' }}
            onClick={() => handleWordClick(index)}
            clickable
          />
        ))}
      </div>
      
      {/* 選択された単語の問題と英文を表示 */}
      {selectedWordIndex !== null && repeatedWrongWordsWithQuestions[selectedWordIndex] && (
        <div 
          style={{ 
            marginTop: '16px', 
            padding: '12px', 
            backgroundColor: 'rgba(255, 235, 235, 0.3)',
            border: '1px solid rgba(255, 0, 0, 0.1)',
            borderRadius: '4px'
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {repeatedWrongWordsWithQuestions[selectedWordIndex].question.sectionName}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {repeatedWrongWordsWithQuestions[selectedWordIndex].question.Japanese}
          </Typography>
          <div>
            {divideQuestion(repeatedWrongWordsWithQuestions[selectedWordIndex].question).map((part: string, partIndex: number) => (
              <span 
                key={partIndex} 
                style={{ 
                  fontWeight: partIndex % 2 === 1 ? 'bold' : 'normal',
                  color: partIndex % 2 === 1 ? '#d32f2f' : 'inherit',
                  backgroundColor: partIndex % 2 === 1 ? 'rgba(255, 235, 235, 0.5)' : 'transparent',
                  padding: partIndex % 2 === 1 ? '0 2px' : '0',
                  borderRadius: partIndex % 2 === 1 ? '2px' : '0'
                }}
              >
                {part}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
