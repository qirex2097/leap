import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import { selectQuestions, QuestionData } from '../questions';
import { SelectQuestions } from './SelectQuestions';
import { Home } from '../routes/Home';
import { Answer } from '../routes/Answer';
import { Question } from '../routes/Question';
import { Result } from '../routes/Result';

const QUESTION_KAZU: number = 10;

export const App = () => {
    const [questions, setQuestions] = React.useState<QuestionData[]>([]);
    const [questionNo, setQuestionNo] = React.useState<number>(0);
    const navigate = useNavigate();

    const selected = (startNo: number, endNo: number) => {
        const sections: number[] = new Array(endNo - startNo + 1).fill(startNo).map((v, i) => v + i);
        const newQuestions = selectQuestions(sections);
        setQuestions(newQuestions);
        setQuestionNo(0);
        navigate('/question');
    }
    const retry = (retryList: number[]) => {
        if (retryList.length === 0) {
            navigate('/');
        } else {
            const retryQuestions: QuestionData[] = questions.filter((v, i) => {
                if (retryList.includes(i)) return v;
            })
            for (const q of retryQuestions) {
                q.correctOrWrong = 0;
            }
            setQuestions(retryQuestions);
            setQuestionNo(0);
            navigate('/question');
        }
    }

    const finished = () => {
        if (questionNo + QUESTION_KAZU > questions.length) {
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
        <SelectQuestions onSelect={selected} />
        <hr></hr>
        <Routes>
            <Route path="/" element={<Home selected={selected} />} />
            <Route path="/leap" element={<Home selected={selected} />} />
            <Route path="/question" element={<Question questions={currentQuestions} updateCorrectWrong={updateCorrectWrong} finished={finished} />} />
            <Route path="/answer" element={<Answer questions={currentQuestions} goOn={goOn} />} />
            <Route path="/finished" element={<Answer questions={currentQuestions} goOn={goResult} />} />
            <Route path="/result" element={<Result questions={questions} retry={retry} />} />
        </Routes>
    </>);
}