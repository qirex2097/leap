import React, { useEffect } from "react";
import Input from "@mui/material/Input";
import InputAdorment from "@mui/material/InputAdornment";
import Check from "@mui/icons-material/Check";
import Clear from "@mui/icons-material/Clear";
import Call from "@mui/icons-material/Call";
import Button from "@mui/material/Button";
import { QuestionData, divideQuestion } from "../questions";

const enum ANSWER_RESULT {
  HINT = -2,
  WRONG = -1,
  NONE = 0,
  CORRECT = 1,
}

const finishButtonId = "finishButton";

const getQuestionId = (questionNo: number, answerNo: number): string => {
  return `question-${questionNo}-${answerNo}`;
};

const QuestionLine = ({
  question,
  questionNo,
  correctOrWrong,
  setCorrectWrong,
}: {
  question: QuestionData;
  questionNo: number;
  correctOrWrong: ANSWER_RESULT
  setCorrectWrong: (value: number) => void;
}) => {
  const [nextElement, setNextElement] = React.useState<HTMLElement | null>(
    null
  );
  const isHintUsed: boolean = correctOrWrong === ANSWER_RESULT.HINT;
  const answerKazu = question.answerPosition.length;

  useEffect(() => {
    nextElement?.focus();
    setNextElement(null);
  }, [nextElement]);

  const evaluateAnswer = (value: string, answerMoji: string): [string, ANSWER_RESULT] => {
    let result = ""
    let correctOrWrong: ANSWER_RESULT = ANSWER_RESULT.NONE;
    if (isHintUsed) {
      result = answerMoji
      correctOrWrong = ANSWER_RESULT.HINT
    } else if (value.toLowerCase() === answerMoji.toLowerCase()) {
      result = answerMoji
      correctOrWrong = ANSWER_RESULT.CORRECT
    } else {
      result = value
      correctOrWrong = ANSWER_RESULT.WRONG
    }
    return [result, correctOrWrong]
  }

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    answerMoji: string
  ): void => {
    if (e.target.value.length === 0) return;

    const [value, result]: [string, ANSWER_RESULT]= evaluateAnswer(e.target.value.trim(), answerMoji)
    e.target.value = value
    setCorrectWrong(result)
  };
  const handleFocus = (
    e: React.FocusEvent<HTMLInputElement>,
    answerMoji: string
  ) => {
    if (isHintUsed) {
      e.target.value = answerMoji;
      return;
    }

    setCorrectWrong(ANSWER_RESULT.NONE);
  };

  const handleChange = (
    e: React.FocusEvent<HTMLInputElement>,
    answerMoji: string,
    answerNo: number
  ): void => {
    const isLastAnswer: boolean = answerKazu <= answerNo + 1;
    const nextAnswerNo = isLastAnswer ? 0 : answerNo + 1;
    const nextQuestionNo = isLastAnswer ? questionNo + 1 : questionNo;
    const nextElementId = getQuestionId(nextQuestionNo, nextAnswerNo);
    const nextElement: HTMLElement | null =
      document.getElementById(nextElementId) ||
      document.getElementById(finishButtonId);

    if (e.target.value.search(/\?/) === 0) {
      e.target.value = answerMoji;
      setCorrectWrong(ANSWER_RESULT.HINT);
      setNextElement(nextElement);
    } else if (e.target.value.search(/ $/) >= 0) {
      if (e.target.value.search(/ /) === 0) {
        e.target.value = ""
      } else {
        const [value, result]: [string, number]= evaluateAnswer(e.target.value.trim(), answerMoji)
        e.target.value = value
        setCorrectWrong(result)
      }
      setNextElement(nextElement);
    }
  };

  let startAdornment: JSX.Element = <></>;
  if (correctOrWrong === ANSWER_RESULT.CORRECT) {
    startAdornment = (
      <InputAdorment position="start">
        <Check />
      </InputAdorment>
    );
  } else if (correctOrWrong === ANSWER_RESULT.WRONG) {
    startAdornment = (
      <InputAdorment position="start">
        <Clear />
      </InputAdorment>
    );
  } else if (correctOrWrong === ANSWER_RESULT.HINT) {
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
      const answerMoji: string = answer.match(/[a-zA-Z\-']+/)?.[0] || "";
      const answerNo: number = Math.floor(i / 2);

      return (
        <span key={i}>
          <Input
            type="text"
            color="secondary"
            id={getQuestionId(questionNo, answerNo)}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
              handleBlur(e, answerMoji)
            }
            onFocus={(e: React.FocusEvent<HTMLInputElement>) =>
              handleFocus(e, answerMoji)
            }
            onChange={(e: React.FocusEvent<HTMLInputElement>) =>
              handleChange(e, answerMoji, answerNo)
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
  correctOrWrong,
  setCorrectOrWrong,
}: {
  questions: QuestionData[];
  correctOrWrong: number[]
  setCorrectOrWrong: (correctOrWrong: number[]) => void
}) => {
  const updateCorrectOrWrong = (idx: number, state: number) => {
    const newCorrectOrWrong = correctOrWrong.map((v, i) => {
      if (i === idx) { return state } else { return v }
    })
    setCorrectOrWrong(newCorrectOrWrong)
  }

  return (
    <>
      {questions.map((v, i) => {
        return (
          <QuestionLine
            key={i}
            question={v}
            questionNo={i}
            correctOrWrong={correctOrWrong[i]}
            setCorrectWrong={(value: number) => updateCorrectOrWrong(i, value)}
          />
        );
      })}
    </>
  );
};
//----------------------------------------
export const Question = ({
  questions,
  finished,
}: {
  questions: QuestionData[];
  finished: (currentIsCorrect: boolean[]) => void;
}) => {
  const [correctOrWrong, setCorrectOrWrong] = React.useState<ANSWER_RESULT[]>(new Array(questions.length).fill(0))

  React.useEffect(() => {
    document.getElementById(getQuestionId(0, 0))?.focus();
  }, []);

  const handleClick = () => {
    const isCorrect: boolean[] = correctOrWrong.map((v) => {
      if (v > 0) return true;
      else return false
    })
    finished(isCorrect)
  }

  return (
    <>
      <Questions
        questions={questions}
        correctOrWrong={correctOrWrong}
        setCorrectOrWrong={setCorrectOrWrong}
      />
      <hr></hr>
      <Button id={finishButtonId} onClick={handleClick}>
        FINISHED
      </Button>
      
      {correctOrWrong.reduce((prev, state) => {if (state > 0) prev += 1; return prev}, 0)}{" "}/ {questions.length}
    </>
  );
};
