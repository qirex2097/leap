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
}: {
  start: (newQuestionData: QuestionData[]) => void;
  wrongQuestionHistory: WrongQuestionHistory[];
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
    
    setLabels(newLabels);
  };

  return (
    <>
      <QuestionList labels={newLabels} handleChange={handleChange} yoko={window.innerWidth > 750 ? 8 : 4}/>
      <Button onClick={questionStart}>START</Button>
      <Button onClick={resetOrSelectAll}>
        {labels.every((v) => v.checked) ? "RESET" : "ALL"}
      </Button>
      <Button onClick={selectRandom}>RANDOM</Button>
      <DropQuestions onLoad={updateLabels} />
      
    </>
  );
};
