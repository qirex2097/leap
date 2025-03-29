import React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  QuestionData,
  addSectionDataFromFile,
  getCurrentSectionData,
  selectQuestions,
  getSelectedSections,
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
  // 問題の選択回数を保存する状態
  const [selectionCounts, setSelectionCounts] = React.useState<Record<number, number>>({});

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
    
    // 選択回数を更新
    const newCounts = { ...selectionCounts };
    selectedSections.forEach(idx => {
      newCounts[idx] = (newCounts[idx] || 0) + 1;
    });
    
    // 選択回数を更新
    setSelectionCounts(newCounts);
    
    // デバッグ用：選択回数を確認
    console.log("Selection counts updated from START:", newCounts);
    
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
      
      // 選択回数もリセット
      setSelectionCounts({});
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
    // すべてを一度リセット
    const resetLabels = labels.map((v) => {
      return { ...v, checked: false };
    });
    
    // 選択するインデックスを格納する配列
    const selectedIndices: number[] = [];
    
    // 現在チェックされている問題を取得
    const checkedIndices = labels
      .map((v, i) => v.checked ? i : -1)
      .filter(idx => idx !== -1);
    
    if (checkedIndices.length > 0) {
      // チェックされている問題のうち最も最後のものを取得
      const lastCheckedIdx = Math.max(...checkedIndices);
      
      // 次のインデックスを計算（最後のインデックスの次）
      const nextIdx = (lastCheckedIdx + 1) % labels.length;
      
      // 選択するインデックスを追加
      selectedIndices.push(lastCheckedIdx);
      selectedIndices.push(nextIdx);
    } else {
      // チェックされている問題がない場合は最初の2つを選択
      if (labels.length >= 2) {
        selectedIndices.push(0);
        selectedIndices.push(1);
      } else if (labels.length === 1) {
        // 問題が1つしかない場合は同じ問題を2回選択
        selectedIndices.push(0);
        selectedIndices.push(0);
      }
    }
    
    // 選択したインデックスのチェックをtrueに設定
    const newLabels = resetLabels.map((v, i) => {
      if (selectedIndices.includes(i)) {
        return { ...v, checked: true };
      }
      return v;
    });
    
    // 選択回数を更新
    const newCounts = { ...selectionCounts };
    selectedIndices.forEach(idx => {
      newCounts[idx] = (newCounts[idx] || 0) + 1;
    });
    
    // 選択回数を更新
    setSelectionCounts(newCounts);
    
    // デバッグ用：選択回数を確認
    console.log("Selection counts updated:", newCounts);
   
    // ラベルを更新
    setLabels(newLabels);
    
    // 選択されたセクションを直接計算して開始
    const selectedSections = selectedIndices;
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
          <Button onClick={selectSequential} >
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
