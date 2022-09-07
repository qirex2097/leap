import React from 'react';
import Button from "@mui/material/Button";
import { QuestionData, divideQuestion } from "../questions";

export const Answers = ({
  wrongQuestions,
}: {
  wrongQuestions: QuestionData[];
}) => {
  return (
    <>
      {wrongQuestions.map((v, i) => {
        const token: string[] = divideQuestion(v);
        const questionLine = token.map((e, i) => {
          if (i % 2 === 0) {
            return <span key={i}>{e}</span>;
          } else {
            return (
              <span key={i} style={{ borderBottom: "solid 3px red" }}>
                {e}
              </span>
            );
          }
        });

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

//----------------------------------------

export const Answer = ({
  questions,
  isCorrect,
  goOn,
}: {
  questions: QuestionData[];
  isCorrect: boolean[];
  goOn: () => void;
}) => {
  React.useEffect(() => {
    const correctNum = isCorrect.reduce((prev, current) => {
      if (current) prev += 1;
      return prev;
    }, 0);
    if (correctNum === questions.length) {
      goOn();
    }
  });

  const wrongQuestions: QuestionData[] = questions.filter((v, i) => {
    if (isCorrect[i]) return false;
    else return true;
  });

  return (
    <>
      <h3>
        {wrongQuestions.length} / {questions.length}
      </h3>
      <Answers wrongQuestions={wrongQuestions} />
      <hr></hr>
      <Button autoFocus={true} onClick={goOn}>
        CONTINUE
      </Button>
    </>
  );
};
