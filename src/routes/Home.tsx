import React, { useRef, useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {
  QuestionData,
  addSectionDataFromFile,
  getCurrentSectionData,
  selectQuestions,
  getSelectedSections,
} from "../questions";
import { DropQuestions } from "../components/DropQuestions";
import { WrongQuestionHistory } from "../components/App";
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
  // NEXTボタンへの参照を作成
  const nextButtonRef = useRef<HTMLButtonElement>(null);

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

  // コンポーネントがマウントされたときに実行
  useEffect(() => {
    // ローカルストレージから前回selectSequentialが呼ばれたかどうかを確認
    const wasSelectSequentialCalled = sessionStorage.getItem('wasSelectSequentialCalled') === 'true';
    if (!wasSelectSequentialCalled) return;
    
    // 現在チェックされている問題を取得
    const checkedIndices = labels
      .map((v, i) => v.checked ? i : -1)
      .filter(idx => idx !== -1);
      
    if (checkedIndices.length === 0) return;
    
    // 最初（インデックス0）と最後（labels.length - 1）の問題がチェックされているかチェック
    if (checkedIndices.includes(0) && checkedIndices.includes(labels.length - 1)) {
      // 最初と最後の問題がチェックされている場合、チェックをクリアして終了
      setLabels(labels.map((v) => { return { ...v, checked: false }; }));
    } else {
      const lastCheckedIdx = Math.max(...checkedIndices);
      const selectedIndices = [lastCheckedIdx, (lastCheckedIdx + 1) % labels.length];
      
      // ラベルを更新
      setLabels(labels.map((v, i) => ({  ...v, checked: selectedIndices.includes(i)  })));

      // 前回selectSequentialが呼ばれていた場合、NEXTボタンにフォーカスを当てる
      nextButtonRef.current?.focus();
    }
    // フラグをリセット
    sessionStorage.removeItem('wasSelectSequentialCalled');
  }, [labels]);

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

  const selectSequential = () => {
    // 現在チェックされている問題を取得
    const selectedSections = labels
      .map((v, i) => v.checked ? i : -1)
      .filter(idx => idx !== -1);

    // selectSequentialが呼ばれたことをローカルストレージに記録
    sessionStorage.setItem('wasSelectSequentialCalled', 'true');
    
    if (selectedSections.length === 0) {
      if (labels.length >= 2) {
        selectedSections.push(0, 1);
      } else {
        selectedSections.push(0);
      }
    }

    start(selectQuestions(selectedSections));
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
          <Button 
            onClick={selectSequential} 
            ref={nextButtonRef}
          >
            NEXT
          </Button>
        </div>
        <div>
          <Button onClick={resetWrongQuestionHistory}>RESET</Button>
        </div>
      </div>
      
      {/* 2回以上間違えた単語を表示するコンポーネント */}
      <ShowWrongWords wrongQuestionHistory={wrongQuestionHistory} />
      
      <DropQuestions onLoad={updateLabels} />
    </>
  );
};
