import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import { QuestionData, randomlySortQuestions } from '../questions';
import { Header } from './Header';
import { Home } from '../routes/Home';
import { Answer } from '../routes/Answer';
import { Question } from '../routes/Question';
import { Result } from '../routes/Result';

const QUESTION_KAZU: number = 10;

export const App = () => {
    const [questions, setQuestions] = React.useState<QuestionData[]>([]);
    const [questionNo, setQuestionNo] = React.useState<number>(0);
    const navigate = useNavigate();

    const start = (newQuestions: QuestionData[]) => {
        setQuestions(newQuestions);
        setQuestionNo(0);
        navigate('/question');
    }
    const retry = (retryList: number[]) => {
        if (retryList.length === 0) {
            setQuestions([]);
            setQuestionNo(0);
            navigate('/');
        } else {
            const retryQuestions: QuestionData[] = questions.filter((v, i) => retryList.includes(i))
            for (const q of retryQuestions) {
                q.correctOrWrong = 0;
            }
            setQuestions(randomlySortQuestions(retryQuestions));
            setQuestionNo(0);
            navigate('/question');
        }
    }

    const finished = () => {
        if (questionNo + QUESTION_KAZU >= questions.length) {
            navigate('/finished');
        } else {
            navigate('/answer');
        }
    }

    const goOn = () => {
        if (questionNo >= questions.length) {
            navigate('/');
        } else {
            setQuestionNo(questionNo + QUESTION_KAZU);
            navigate('/question');
        }
    }
    const goResult = () => {
        navigate('/result')
    }
    const goHome = () => {
        setQuestions([]);
        setQuestionNo(0);
        navigate('/leap')
    }

    const updateCorrectWrong = (idx: number, status: number) => {
        const newQuestions: QuestionData[] = questions.map((v, i) => {
            if (i === idx + questionNo) {
                return { ...v, correctOrWrong: status }
            } else {
                return v;
            }
        })
        setQuestions(newQuestions);
    }

    const currentQuestions: QuestionData[] = questions.slice(questionNo, questionNo + QUESTION_KAZU);

    return (<>
        <Header goHome={goHome} questionKazu={questions.length}
            questionStartNo={questionNo} questionEndNo={questionNo + currentQuestions.length - 1} />
        <hr></hr>
        <Routes>
            <Route path="/" element={<Home start={start} />} />
            <Route path="/leap" element={<Home start={start} />} />
            <Route path="/question" element={<Question questions={currentQuestions} updateCorrectWrong={updateCorrectWrong} finished={finished} />} />
            <Route path="/answer" element={<Answer questions={currentQuestions} goOn={goOn} />} />
            <Route path="/finished" element={<Answer questions={currentQuestions} goOn={goResult} />} />
            <Route path="/result" element={<Result questions={questions} retry={retry} />} />
        </Routes>
    </>);
}