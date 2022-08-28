import React from "react";
import Input from "@mui/material/Input";
import InputAdorment from "@mui/material/InputAdornment";
import Check from "@mui/icons-material/Check";
import Clear from "@mui/icons-material/Clear";
import Call from "@mui/icons-material/Call";

import { QuestionData, divideQuestion } from "../questions";

const Question = ({
  question,
  correctOrWrong,
  setCorrectWrong,
}: {
  question: QuestionData;
  correctOrWrong: number;
  setCorrectWrong: (value: number) => void;
}) => {
  const [English, Japanese]: string[] = [question.English, question.Japanese];
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

  const answers: number[][] = question.answers || [[0, English.length]];

  const questionLines: JSX.Element[] = [];
  let prevPos: number = 0;
  for (const [first, second] of answers) {
    const answer = English.substring(first, second);
    const separater: string = answer.match(/[?.,:;]$/)?.[0] || "";
    const answer_moji: string = answer.match(/[a-zA-Z\-']+/)?.[0] || "";
    questionLines.push(<span>{English.substring(prevPos, first)}</span>);
    questionLines.push(
      <span>
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
          style={{ width: answer.length * 16 + 24, height: 24 }}
          startAdornment={startAdornment}
        />
        {separater}
      </span>
    );
    prevPos = second;
  }
  questionLines.push(<span>{English.substring(prevPos)}</span>);

  return (
    <>
      <div>{Japanese}</div>
      <div>{questionLines}</div>
      <p></p>
    </>
  );
};

export const Questions = ({
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
          <Question
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

export const Answers = ({ questions }: { questions: QuestionData[] }) => {
  const correctNum: number = questions.reduce((prev, e) => {
    if (e.correctOrWrong > 0) prev += 1;
    return prev;
  }, 0);

  const wrongQuestions: QuestionData[] = questions.filter((v, i) => {
    if (questions[i].correctOrWrong <= 0) return v;
    else return "";
  });

  return (
    <>
      <h3>
        {correctNum} / {questions.length}
      </h3>
      {wrongQuestions.map((v, i) => {
        const token: string[] = divideQuestion(v)
        const questionLine = token.map((e, i) => {
          if (i % 2 === 0) {
            return <span key={i}>{e}</span>
          } else {
            return <span key={i} style={{borderBottom: "solid 3px red"}}>
              {e}
            </span>
          }
        })

        return (
          <div key={i}>
            <div>
              {v.Japanese} / {v.sectionName}
            </div>
            <div>{questionLine}</div>
            <p></p>
          </div>
        );
      })}
    </>
  );
};
