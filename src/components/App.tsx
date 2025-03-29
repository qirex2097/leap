import React from "react";
import { useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

import { QuestionData, randomlySortQuestions } from "../questions";
import { Header } from "./Header";
import { Home } from "../routes/Home";
import { Answer } from "../routes/Answer";
import { Question } from "../routes/Question";
import { Result } from "../routes/Result";

const QUESTION_KAZU: number = 10;

// 間違えた問題の履歴を保存する型
export type WrongQuestionHistory = {
  date: Date;
  wrongQuestions: QuestionData[];
  totalQuestions: number;
};

export const App = () => {
  const [questions, setQuestions] = React.useState<QuestionData[]>([]);
  const [questionNo, setQuestionNo] = React.useState<number>(0);
  const [isCorrect, setIsCorrect] = React.useState<boolean[]>([]);
  // 間違えた問題の履歴を保存する状態
  const [wrongQuestionHistory, setWrongQuestionHistory] = React.useState<WrongQuestionHistory[]>([]);
  
  // 間違えた問題の履歴をリセットする関数
  const resetWrongQuestionHistory = () => {
    setWrongQuestionHistory([]);
  };
  const navigate = useNavigate();

  const start = (newQuestions: QuestionData[]) => {
    setQuestions(newQuestions);
    setQuestionNo(0);
    setIsCorrect(new Array(newQuestions.length).fill(false));
    navigate("/question");
  };

  const retry = (retryQuestions: QuestionData[]) => {
    // 間違えた問題の履歴を保存
    if (retryQuestions.length > 0) {
      const newHistory: WrongQuestionHistory = {
        date: new Date(),
        wrongQuestions: [...retryQuestions],
        totalQuestions: questions.length
      };
      setWrongQuestionHistory([...wrongQuestionHistory, newHistory]);
    }

    if (retryQuestions.length === 0) {
      navigate("/");
    } else {
      const newQuestions: QuestionData[] =
        randomlySortQuestions(retryQuestions);
      start(newQuestions);
    }
  };

  const finished = (currentIsCorrect: boolean[]) => {
    const newIsCorrect: boolean[] = isCorrect.map((v, i) => {
      if (questionNo <= i && i < questionNo + currentIsCorrect.length) {
        return currentIsCorrect[i - questionNo]
      } else {
        return v;
      }
    });
    setIsCorrect(newIsCorrect);
    if (questionNo + QUESTION_KAZU >= questions.length) {
      navigate("/finished");
    } else {
      navigate("/answer");
    }
  };

  const goOn = () => {
    if (questionNo >= questions.length) {
      navigate("/");
    } else {
      setQuestionNo(questionNo + QUESTION_KAZU);
      navigate("/question");
    }
  };

  const currentQuestions: QuestionData[] = questions.slice(
    questionNo,
    questionNo + QUESTION_KAZU
  );
  const currentIsCorrect: boolean[] = isCorrect.slice(
    questionNo,
    questionNo + QUESTION_KAZU
  );

  return (
    <>
      <Header
        goHome={() => navigate("/")}
        questionKazu={questions.length}
        questionStartNo={questionNo}
        questionEndNo={questionNo + currentQuestions.length - 1}
      />
      <hr></hr>
      <Routes>
        <Route path="/" element={<Home start={start} wrongQuestionHistory={wrongQuestionHistory} resetWrongQuestionHistory={resetWrongQuestionHistory} />} />
        <Route
          path="/question"
          element={
            <Question questions={currentQuestions} finished={finished} />
          }
        />
        <Route
          path="/answer"
          element={
            <Answer
              questions={currentQuestions}
              isCorrect={currentIsCorrect}
              goOn={goOn}
            />
          }
        />
        <Route
          path="/finished"
          element={
            <Answer
              questions={currentQuestions}
              isCorrect={currentIsCorrect}
              goOn={() => navigate("/result") }
            />
          }
        />
        <Route
          path="/result"
          element={
            <Result questions={questions} isCorrect={isCorrect} retry={retry} />
          }
        />
      </Routes>
    </>
  );
};
