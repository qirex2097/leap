import React from "react";
import Input from "@mui/material/Input";
import InputAdorment from "@mui/material/InputAdornment";
import Check from "@mui/icons-material/Check";
import Clear from "@mui/icons-material/Clear";
import Call from "@mui/icons-material/Call";
import Button from "@mui/material/Button";
import { QuestionData, divideQuestion } from "../questions";

const QuestionLine = ({
  question,
  correctOrWrong,
  setCorrectWrong,
}: {
  question: QuestionData;
  correctOrWrong: number;
  setCorrectWrong: (value: number) => void;
}) => {
  const NONE: number = 0;
  const CORRECT: number = 1;
  const WRONG: number = -1;
  const HINT: number = -2;
  const isHintUsed: boolean = correctOrWrong === HINT;

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    answer_moji: string
  ): void => {
    if (e.target.value.length === 0) return;

    if (isHintUsed) {
      e.target.value = answer_moji;
    } else if (e.target.value.toLowerCase() === answer_moji.toLowerCase()) {
      e.target.value = answer_moji;
      setCorrectWrong(CORRECT);
    } else {
      setCorrectWrong(WRONG);
    }
  };
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (isHintUsed) return;

    setCorrectWrong(NONE);
  };
  const handleChange = (
    e: React.FocusEvent<HTMLInputElement>,
    answer_moji: string
  ): void => {
    if (e.target.value === " ") {
      e.target.value = answer_moji;
      setCorrectWrong(HINT);
    }
  };

  let startAdornment: JSX.Element = <></>;
  if (correctOrWrong === CORRECT) {
    startAdornment = (
      <InputAdorment position="start">
        <Check />
      </InputAdorment>
    );
  } else if (correctOrWrong === WRONG) {
    startAdornment = (
      <InputAdorment position="start">
        <Clear />
      </InputAdorment>
    );
  } else if (correctOrWrong === HINT) {
    startAdornment = (
      <InputAdorment position="start">
        <Call />
      </InputAdorment>
    );
  }

  const token: string[] = divideQuestion(question);
  const questionLines: JSX.Element[] = token.map((partOfEnglish, i) => {
    if (i % 2 === 0) {
      return <span key={i}>{partOfEnglish}</span>;
    } else {
      const answer = partOfEnglish;
      const separater: string = answer.match(/[?.,:;]$/)?.[0] || "";
      const answer_moji: string = answer.match(/[a-zA-Z\-']+/)?.[0] || "";

      return (
        <span key={i}>
          <Input
            type="text"
            color="secondary"
            onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
              handleBlur(e, answer_moji)
            }
            onFocus={handleFocus}
            onChange={(e: React.FocusEvent<HTMLInputElement>) =>
              handleChange(e, answer_moji)
            }
            style={{ width: answer.length * 16 + 24, fontSize: "100%" }}
            autoComplete="off"
            startAdornment={startAdornment}
          />
          {separater}
        </span>
      );
    }
  });

  return (
    <>
      <div>{question.Japanese}</div>
      <div>{questionLines}</div>
      <p></p>
    </>
  );
};

const Questions = ({
  questions,
  updateCorrectWrong,
}: {
  questions: QuestionData[];
  updateCorrectWrong: (idx: number, status: number) => void;
}) => {
  return (
    <>
      {questions.map((v, i) => {
        return (
          <QuestionLine
            key={i}
            question={v}
            correctOrWrong={questions[i].correctOrWrong}
            setCorrectWrong={(value: number) => updateCorrectWrong(i, value)}
          />
        );
      })}
    </>
  );
};
//----------------------------------------
export const Question = ({
  questions,
  updateCorrectWrong,
  finished,
}: {
  questions: QuestionData[];
  updateCorrectWrong: (idx: number, status: number) => void;
  finished: () => void;
}) => {
  return (
    <>
      <Questions
        questions={questions}
        updateCorrectWrong={updateCorrectWrong}
      />
      <hr></hr>
      <Button onClick={finished}>FINISHED</Button>
      {questions.reduce((prev, question) => {
        if (question.correctOrWrong > 0) prev += 1;
        return prev;
      }, 0)}{" "}
      / {questions.length}
    </>
  );
};
