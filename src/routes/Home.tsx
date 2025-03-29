import React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  QuestionData,
  addSectionDataFromFile,
  getCurrentSectionData,
  selectQuestions,
  getSelectedSections,
  getAnswers,
  divideQuestion,
} from "../questions";
import { DropQuestions } from "../components/DropQuestions";
import { WrongQuestionHistory } from "../components/App";
import { ShowQuestions } from "../components/ShowQuestions";
import { ShowWrongWords } from "../components/ShowWrongWords";

type Label = {
  label: string;
  checked: boolean;
  group: string;
  idx: number;
};

const QuestionList = ({
  labels,
  handleChange,
  yoko,
}: {
  labels: Label[]
  handleChange: (idx: number, checked: boolean) => void
  yoko: number
}): JSX.Element => {
  return (
      <details open>
        <summary></summary>
        <Grid container spacing={0}>
          {labels.map((v) => {
            return (
              <Grid item key={v.idx} xs={12 / yoko}>
                <FormControlLabel
                  key={v.idx}
                  checked={v.checked}
                  control={<Checkbox />}
                  onChange={(event: React.SyntheticEvent, checked: boolean) =>
                    handleChange(v.idx, checked)
                  }
                  label={v.label}
                />
              </Grid>
            );
          })}
        </Grid>
      </details>
  );
};

export const Home = ({
  start,
  wrongQuestionHistory,
  resetWrongQuestionHistory,
}: {
  start: (newQuestionData: QuestionData[]) => void;
  wrongQuestionHistory: WrongQuestionHistory[];
  resetWrongQuestionHistory: () => void;
}): JSX.Element => {
  const [labels, setLabels] = React.useState<Label[]>(
    getCurrentSectionData().map((v, i) => {
      const filename = v.filename || "no name";
      return {
        label: `${filename}`,
        checked: getSelectedSections().includes(i),
        group: v.group,
        idx: i,
      };
    })
  );
  let newLabels = [...labels];

  const questionStart = () => {
    const selectedSections: number[] = labels
      .map((v, i) => {
        if (v.checked) return i;
        else return -1;
      })
      .filter((v) => v >= 0);
    start(selectQuestions(selectedSections));
  };

  const updateLabels = (
    filename: string,
    result: string,
    group: string
  ): void => {
    addSectionDataFromFile(filename, result, group);

    newLabels = getCurrentSectionData().map((v, i) => {
      return { label: `${v.filename}`, checked: false, group: v.group, idx: i };
    });
    setLabels(newLabels);
  };

  const handleChange = (idx: number, checked: boolean) => {
    const newLabels = labels.map((v, i) => {
      if (idx === i) return { ...v, checked: checked };
      else return v;
    });
    setLabels(newLabels);
  };

  const resetOrSelectAll = () => {
    // すべてが選択されているかチェック
    const allSelected = labels.every((v) => v.checked);
    
    if (allSelected) {
      // すべて選択されている場合はリセット
      setLabels(
        labels.map((v) => {
          return { ...v, checked: false };
        })
      );
    } else {
      // 一つでも未選択があればすべて選択
      setLabels(
        labels.map((v) => {
          return { ...v, checked: true };
        })
      );
    }
  };

  const resetAll = () => {
    // すべての選択をリセット
    setLabels(
      labels.map((v) => {
        return { ...v, checked: false };
      })
    );
  };


  const selectRandom = () => {
    // すべてを一度リセット
    const resetLabels = labels.map((v) => {
      return { ...v, checked: false };
    });
    
    // ランダムに2つ選択
    const availableIndices = labels.map((_, i) => i);
    const selectedIndices: number[] = [];
    
    // 2つ選択するか、利用可能な数が2未満の場合はすべて選択
    const selectCount = Math.min(2, availableIndices.length);
    
    for (let i = 0; i < selectCount; i++) {
      const randomIndex = Math.floor(Math.random() * availableIndices.length);
      const selectedIdx = availableIndices.splice(randomIndex, 1)[0];
      selectedIndices.push(selectedIdx);
    }
    
    // 選択したインデックスのチェックをtrueに設定
    const newLabels = resetLabels.map((v, i) => {
      if (selectedIndices.includes(i)) {
        return { ...v, checked: true };
      }
      return v;
    });
    
    // ラベルを更新
    setLabels(newLabels);
    
    // 選択されたセクションを直接計算して開始
    const selectedSections = selectedIndices;
    start(selectQuestions(selectedSections));
  };

  // 選択された単語の状態
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
  
  return (
    <>
      <QuestionList labels={newLabels} handleChange={handleChange} yoko={window.innerWidth > 750 ? 8 : 4}/>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Button onClick={questionStart}>START</Button>
          <Button onClick={resetOrSelectAll}>
            {labels.every((v) => v.checked) ? "RESET" : "ALL"}
          </Button>
          <Button onClick={selectRandom}>RANDOM</Button>
        </div>
        <div>
          <Button onClick={resetWrongQuestionHistory}>RESET</Button>
        </div>
      </div>
      
      {/* 2回以上間違えた単語がある場合のみ表示 */}
      {repeatedWrongWordsWithQuestions.length > 0 && (
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
      )}
      
      <DropQuestions onLoad={updateLabels} />
    </>
  );
};
