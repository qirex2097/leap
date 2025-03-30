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

// Session storage utility functions
const SESSION_KEY_SELECT_SEQUENTIAL = "wasSelectSequentialCalled";
const setSelectSequentialCalled = (value: boolean) => {
  sessionStorage.setItem(SESSION_KEY_SELECT_SEQUENTIAL, value.toString());
};
const wasSelectSequentialCalled = () => {
  return sessionStorage.getItem(SESSION_KEY_SELECT_SEQUENTIAL) === "true";
};
const clearSelectSequentialCalled = () => {
  sessionStorage.removeItem(SESSION_KEY_SELECT_SEQUENTIAL);
};

type Label = {
  label: string;
  checked: boolean;
  group: string;
  idx: number;
};

type QuestionListProps = {
  labels: Label[];
  handleChange: (idx: number, checked: boolean) => void;
  yoko: number;
};

const QuestionList: React.FC<QuestionListProps> = ({
  labels,
  handleChange,
  yoko,
}) => {
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

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
};

type ActionButtonsProps = {
  onStart: () => void;
  onResetOrSelectAll: () => void;
  onSelectSequential: () => void;
  onResetHistory: () => void;
  allSelected: boolean;
  nextButtonRef: React.RefObject<HTMLButtonElement>;
};

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onStart,
  onResetOrSelectAll,
  onSelectSequential,
  onResetHistory,
  allSelected,
  nextButtonRef
}) => (
  <div style={buttonContainerStyle}>
    <div>
      <Button onClick={onStart}>START</Button>
      <Button onClick={onResetOrSelectAll}>
        {allSelected ? "RESET" : "ALL"}
      </Button>
      <Button onClick={onSelectSequential} ref={nextButtonRef}>
        NEXT
      </Button>
    </div>
    <div>
      <Button onClick={onResetHistory}>RESET</Button>
    </div>
  </div>
);
 
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

const areAllLabelsSelected = (labels: Label[]): boolean => {
  return labels.every((v) => v.checked);
};

// ラベルを生成するユーティリティ関数
const generateLabels = (): Label[] => {
  return getCurrentSectionData().map((v, i) => ({
    label: v.filename || "no name",
    checked: false,
    group: v.group,
    idx: i,
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

  const [labels, setLabels] = React.useState<Label[]>(() => {
    const initialLabels = generateLabels();
    return initialLabels.map((label, i) => ({
      ...label,
      checked: getSelectedSections().includes(i),
    }));
  });

  useEffect(() => {
    const wasSequentialCalled = wasSelectSequentialCalled();
    if (!wasSequentialCalled) return;

    const checkedIndices = getCheckedIndices(labels);

    if (checkedIndices.length === 0) return;
    
    const currentLabelsState = JSON.stringify(labels);

    if (labels.length > 0 && checkedIndices.includes(0) && checkedIndices.includes(labels.length - 1)) {
      const resetLabelsResuilt = resetLabels(labels);
      if (JSON.stringify(resetLabelsResuilt) !== currentLabelsState) {
        setLabels(resetLabelsResuilt);
      }  
    } else {
      const lastCheckedIdx = Math.max(...checkedIndices);
      const updatedLabelsResult = updateSequentialLabels(labels, lastCheckedIdx);
      if (JSON.stringify(updatedLabelsResult) !== currentLabelsState) {
        setLabels(updatedLabelsResult);
      }
      if (!nextButtonRef.current?.contains(document.activeElement)) {
        nextButtonRef.current?.focus();
      }
    }

    clearSelectSequentialCalled();
  }, [labels]); // labelsを依存関係に追加

  const questionStart = () => {
    const selectedSections = getCheckedIndices(labels);
    start(selectQuestions(selectedSections));
  };

  const updateLabels = (filename: string, result: string, group: string): void => {
    addSectionDataFromFile(filename, result, group);
    setLabels(generateLabels());
  };

  const handleChange = (idx: number, checked: boolean) => {
    setLabels((prevLabels) =>
      prevLabels.map((v, i) => (i === idx ? { ...v, checked } : v))
    );
  };

  const resetOrSelectAll = () => {
    const allSelected = areAllLabelsSelected(labels);
    setLabels((prevLabels) =>
      prevLabels.map((v) => ({ ...v, checked: !allSelected }))
    );
  };

  const selectSequential = () => {
    const selectedSections = getCheckedIndices(labels);
    setSelectSequentialCalled(true);

    if (selectedSections.length === 0) {
      const defaultSections = labels.length >= 2 ? [0, 1] : [0];
      selectedSections.push(...defaultSections);
    }

    start(selectQuestions(selectedSections));
  };

  const allLabelsSelected = areAllLabelsSelected(labels);

  const yoko = window.innerWidth > 750 ? 8 : 4;
 
 return (
    <>
      <QuestionList
        labels={labels}
        handleChange={handleChange}
        yoko={yoko}
      />
      <ActionButtons 
        onStart={questionStart}
        onResetOrSelectAll={resetOrSelectAll}
        onSelectSequential={selectSequential}
        onResetHistory={resetWrongQuestionHistory}
        allSelected={allLabelsSelected}
        nextButtonRef={nextButtonRef}
      />        
      <ShowWrongWords wrongQuestionHistory={wrongQuestionHistory} />
      <DropQuestions onLoad={updateLabels} />
    </>
  );
};
