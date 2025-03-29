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

// チェックされたインデックスを取得するユーティリティ関数
const getCheckedIndices = (labels: Label[]): number[] => {
  return labels
    .map((v, i) => (v.checked ? i : -1))
    .filter((idx) => idx !== -1);
};

// ラベルをリセットするユーティリティ関数
const resetLabels = (labels: Label[]): Label[] => {
  return labels.map((v) => ({ ...v, checked: false }));
};

// ラベルを更新するユーティリティ関数
const updateSequentialLabels = (labels: Label[], lastCheckedIdx: number): Label[] => {
  const selectedIndices = [lastCheckedIdx, (lastCheckedIdx + 1) % labels.length];
  return labels.map((v, i) => ({
    ...v,
    checked: selectedIndices.includes(i),
  }));
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
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  const [labels, setLabels] = React.useState<Label[]>(
    getCurrentSectionData().map((v, i) => ({
      label: v.filename || "no name",
      checked: getSelectedSections().includes(i),
      group: v.group,
      idx: i,
    }))
  );

  useEffect(() => {
    const wasSelectSequentialCalled =
      sessionStorage.getItem("wasSelectSequentialCalled") === "true";
    if (!wasSelectSequentialCalled) return;

    const checkedIndices = getCheckedIndices(labels);

    if (checkedIndices.length === 0) return;

    if (checkedIndices.includes(0) && checkedIndices.includes(labels.length - 1)) {
      setLabels(resetLabels(labels));
    } else {
      const lastCheckedIdx = Math.max(...checkedIndices);
      setLabels(updateSequentialLabels(labels, lastCheckedIdx));
      nextButtonRef.current?.focus();
    }

    sessionStorage.removeItem("wasSelectSequentialCalled");
  }, [labels]);

  const questionStart = () => {
    const selectedSections = getCheckedIndices(labels);
    start(selectQuestions(selectedSections));
  };

  const updateLabels = (filename: string, result: string, group: string): void => {
    addSectionDataFromFile(filename, result, group);
    const newLabels = getCurrentSectionData().map((v, i) => ({
      label: v.filename || "no name",
      checked: false,
      group: v.group,
      idx: i,
    }));
    setLabels(newLabels);
  };

  const handleChange = (idx: number, checked: boolean) => {
    setLabels((prevLabels) =>
      prevLabels.map((v, i) => (i === idx ? { ...v, checked } : v))
    );
  };

  const resetOrSelectAll = () => {
    const allSelected = labels.every((v) => v.checked);
    setLabels(labels.map((v) => ({ ...v, checked: !allSelected })));
  };

  const selectSequential = () => {
    const selectedSections = getCheckedIndices(labels);
    sessionStorage.setItem("wasSelectSequentialCalled", "true");

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
      <QuestionList
        labels={labels}
        handleChange={handleChange}
        yoko={window.innerWidth > 750 ? 8 : 4}
      />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <Button onClick={questionStart}>START</Button>
          <Button onClick={resetOrSelectAll}>
            {labels.every((v) => v.checked) ? "RESET" : "ALL"}
          </Button>
          <Button onClick={selectSequential} ref={nextButtonRef}>
            NEXT
          </Button>
        </div>
        <div>
          <Button onClick={resetWrongQuestionHistory}>RESET</Button>
        </div>
      </div>
      <ShowWrongWords wrongQuestionHistory={wrongQuestionHistory} />
      <DropQuestions onLoad={updateLabels} />
    </>
  );
};
