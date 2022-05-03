import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import { SelectQuestions } from './SelectQuestions';
import { Home } from '../routes/Home';
import { About } from '../routes/About';
import { Contact } from '../routes/Contact';

//----------------------------------------
import data from '../data.json';

const QUESTION_KAZU: number = 10;

const getAnswer = (English: string, word: string): string => {
    let answer: string = "";
    for (const w of English.split(' ')) {
        if (w.toLowerCase().search(word) >= 0) {
            answer = w;
        }
    }

    return answer;
}

const selectQuestions = (pages: number[], kazu: number = 10): { questionNo: number, English: string, Japanese: string, answer: string }[] => {
    let candidateQuestions: { English: string, Japanese: string, word: string }[] = []
    for (const p of pages) {
        if (p < 0 || data.length <= p) continue;
        candidateQuestions = [...candidateQuestions, ...data[p].sentences]
    }
    let allQuestionNumbers: number[] = Array(candidateQuestions.length).fill(0).map((v, i) => i);
    let questionNumbers: number[] = [];
    while (questionNumbers.length < kazu && questionNumbers.length < candidateQuestions.length) {
        const candidateNumbers = allQuestionNumbers.filter((v) => !questionNumbers.includes(v));
        const questionNumber = candidateNumbers[Math.floor(Math.random() * candidateNumbers.length)];
        questionNumbers.push(questionNumber);
    }

    let questions: { questionNo: number, English: string, Japanese: string, answer: string }[] = [];
    for (const q of questionNumbers) {
        const sentence = candidateQuestions[q];
        const answer = getAnswer(sentence.English, sentence.word);
        questions.push({ questionNo: q, ...candidateQuestions[q], answer });
    }
    return questions;
}
//----------------------------------------

export const App = () => {
    const [startNo, setStartNo] = React.useState<number>(0);
    const [endNo, setEndNo] = React.useState<number>(0);
    const [questions, setQuestions] = React.useState<{ English: string, Japanese: string, answer: string }[]>([]);
    const [correctTable, setCorrectTable] = React.useState<number[]>([]);
    const navigate = useNavigate();

    const selected = (startNo: number = -1, endNo: number =-1) => {
        if (0 <= startNo) {
            setStartNo(startNo);
        }
        if (0 <= endNo) {
            setEndNo(endNo);
        }
        const sections: number[] = new Array(endNo - startNo + 1).fill(startNo).map((v, i) => v + i);
        const newQuestions = selectQuestions(sections, QUESTION_KAZU);
        setQuestions(newQuestions);
        setCorrectTable(new Array(newQuestions.length).fill(0));
        navigate('/contact');
    }

    const finished = () => {
        const newCorrectTable: number[] = correctTable.map((v, i) => { return v ? v : -1 });
        setCorrectTable(newCorrectTable);

        navigate('/about');
    }

    const retry = () => {
        const sections: number[] = new Array(endNo - startNo + 1).fill(startNo).map((v, i) => v + i);
        const newQuestions = selectQuestions(sections, QUESTION_KAZU);
        setQuestions(newQuestions);
        setCorrectTable(new Array(newQuestions.length).fill(0));
        navigate('/contact');
    }

    const gohome = () => {
        navigate('/');
    }

    const updateCorrectTable = (idx: number, status: number) => {
        const newCorrectTable: number[] = correctTable.map((v, i) => { return i === idx ? status : v })
        setCorrectTable(newCorrectTable);
    }

    return (<>
        <SelectQuestions onSelect={selected} />
        <hr></hr>
        <Routes>
            <Route path="/" element={<Home selected={selected}/>} />
            <Route path="/contact" element={<Contact questions={questions} correctTable={correctTable} updateCorrectTable={updateCorrectTable} finished={finished}/>} />
            <Route path="/about" element={<About questions={questions} correctTable={correctTable} retry={retry} gohome={gohome}/>} />
        </Routes>
        <hr></hr>
    </>);
}