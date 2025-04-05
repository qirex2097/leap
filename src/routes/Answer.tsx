import React from 'react';
import Button from "@mui/material/Button";
import { QuestionData, divideQuestion } from "../questions";
import JapaneseText from "../components/JapaneseText";

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
          return (
            <span key={i} style={{ 
              fontWeight: i % 2 === 1 ? 'bold' : 'normal',
              backgroundColor: i % 2 === 1 ? '#ffeeee' : 'transparent'
            }}>
              {e}
            </span>
          );
        });

        return (
          <div key={i}>
            <div>
              <JapaneseText text={`${v.Japanese} / ${v.sectionName}`} />
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
