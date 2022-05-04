import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import { selectQuestions, QuestionData } from '../questions';
import { SelectQuestions } from './SelectQuestions';
import { Home } from '../routes/Home';
import { About } from '../routes/Answer';
import { Question } from '../routes/Question';

const QUESTION_KAZU: number = 10;

export const App = () => {
    const [startNo, setStartNo] = React.useState<number>(0);
    const [endNo, setEndNo] = React.useState<number>(0);
    const [questions, setQuestions] = React.useState<QuestionData[]>([]);
    const navigate = useNavigate();

    const selected = (startNo: number = -1, endNo: number =-1, isAll: boolean = false) => {
        let kazu = QUESTION_KAZU
        if (isAll) {
            kazu = 0
        }
        if (0 <= startNo) {
            setStartNo(startNo);
        }
        if (0 <= endNo) {
            setEndNo(endNo);
        }
        const sections: number[] = new Array(endNo - startNo + 1).fill(startNo).map((v, i) => v + i);
        const newQuestions = selectQuestions(sections, kazu);
        setQuestions(newQuestions);
        navigate('/question');
    }

    const finished = () => {
        navigate('/answer');
    }

    const retry = () => {
        const sections: number[] = new Array(endNo - startNo + 1).fill(startNo).map((v, i) => v + i);
        const newQuestions = selectQuestions(sections, QUESTION_KAZU);
        setQuestions(newQuestions);
        navigate('/question');
    }

    const gohome = () => {
        navigate('/');
    }

    const updateCorrectWrong = (idx: number, status: number) => {
        const newQuestions: QuestionData[] = questions.map((v, i) => {
            if (i === idx) {
                return {...v, correctOrWrong: status}
            } else {
                return v;
            }
        })
        setQuestions(newQuestions);
    }

    return (<>
        <SelectQuestions onSelect={selected} />
        <hr></hr>
        <Routes>
            <Route path="/" element={<Home selected={selected}/>} />
            <Route path="/question" element={<Question questions={questions} updateCorrectWrong={updateCorrectWrong} finished={finished}/>} />
            <Route path="/answer" element={<About questions={questions} retry={retry} gohome={gohome}/>} />
        </Routes>
    </>);
}