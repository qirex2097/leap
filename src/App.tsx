import React from 'react';
import Select from '@mui/material/Select';
import { SelectChangeEvent } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { Questions } from './Questions';
import data from './data.json';

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

const SelectQuestions = ({ onSelect }: { onSelect: (startNo: number, endNo: number) => void}) => {
    const [startNo, setStartNo] = React.useState(0);
    const [endNo, setEndNo] = React.useState(data.length - 1);

    const handleStartNoChanged = (e: SelectChangeEvent<number>) => {
        const newStartNo = e.target.value as number;
        setStartNo(newStartNo);
        if (endNo < newStartNo) {
            setEndNo(newStartNo);
        }
    }
    const handleEndNoChanged = (e: SelectChangeEvent<number>) => {
        const newEndNo = e.target.value as number;
        setEndNo(newEndNo);
        if (newEndNo < startNo) {
            setStartNo(newEndNo);
        }
    }

    return (<>
        <Select
            value={startNo}
            label="start"
            size="small"
            onChange={handleStartNoChanged}
        >
            {data.map((v, i) => {
                const moji = `${v.start}`;
                return <MenuItem key={i} value={i}>{moji}</MenuItem>
            })}
        </Select>
        <> - </>
        <Select
            value={endNo}
            label="end"
            size="small"
            onChange={handleEndNoChanged}
        >
            {data.map((v, i) => {
                const moji = `${v.end}`;
                return <MenuItem key={i} value={i}>{moji}</MenuItem>
            })}
        </Select>
        <Button onClick={() => { onSelect(startNo, endNo) }}>SELECT</Button>
    </>)
}

export const App = () => {
    const [questions, setQuestions] = React.useState<{ English: string, Japanese: string, answer: string }[]>([]);
    const [correctTable, setCorrectTable] = React.useState<number[]>([]);

    const questionSelected = (startNo: number, endNo: number) => {
        const sections: number[] = new Array(endNo - startNo + 1).fill(startNo).map((v, i) => v + i);
        const newQuestions = selectQuestions(sections, QUESTION_KAZU);
        setQuestions(newQuestions);
        setCorrectTable(new Array(newQuestions.length).fill(0));
    }

    const updateCorrectTable = (idx: number, status: number) => {
        const newCorrectTable: number[] = correctTable.map((v, i) => { return i === idx ? status : v })
        setCorrectTable(newCorrectTable);
    }

    return (<>
        <SelectQuestions onSelect={questionSelected}/>
        <hr></hr>
        <Questions questions={questions} correctTable={correctTable} updateCorrectTable={updateCorrectTable}/>
    </>);
}