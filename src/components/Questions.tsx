import React from 'react';
import Input from '@mui/material/Input';
import InputAdorment from '@mui/material/InputAdornment'
import Check from '@mui/icons-material/Check';
import Clear from '@mui/icons-material/Clear';

import { QuestionData } from '../questions';

const Question = ({ English, Japanese, answer, isCorrect, setCorrectWrong }
    : {
        English: string, Japanese: string, answer: string,
        isCorrect: number,
        setCorrectWrong: (value: number) => void
    }) => {
    const separater: string = answer.match(/[?.,:;]$/)?.[0] || ' ';

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.target.value.length === 0) return;

        const answer_moji: string = answer.match(/[a-zA-Z\-']+/)?.[0] || '';
        if (e.target.value.toLowerCase() == answer_moji.toLowerCase()) {
            setCorrectWrong(1);
        } else {
            setCorrectWrong(-1);
        }
    }
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setCorrectWrong(0);
    }

    let startAdornment: JSX.Element;
    if (0 < isCorrect) {
        startAdornment = <InputAdorment position="start"><Check /></InputAdorment>
    } else if (isCorrect < 0) {
        startAdornment = <InputAdorment position="start"><Clear /></InputAdorment>
    }

    const description = English.split(' ').map((v, i) => {
        if (v.search(answer) >= 0) {
            return (<span key={i}>
                <Input type="text" color='secondary'
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    style={{ width: answer.length * 12 + 24 }}
                    startAdornment={startAdornment}
                />
                {separater}</span>);
        } else {
            return <span key={i}>{v}&nbsp;</span>
        }
    });

    return (<>
        <div>{Japanese}</div>
        <div>{description}</div>
        <p></p>
    </>);
}


export const Questions = ({ questions, updateCorrectWrong }:
    {
        questions: QuestionData[]
        updateCorrectWrong: (idx: number, status: number) => void
    }) => {
    const kazu = questions.length;

    return (<>
        {questions.map((v, i) => {
            return (<Question key={i} {...v}
                isCorrect={questions[i].correctOrWrong}
                setCorrectWrong={(value: number) => updateCorrectWrong(i, value)}
            />);
        })}
    </>);
}

export const Answers = ({ questions }:
    {
        questions: QuestionData[]
    }) => {
    const correctNum: number = questions.reduce((prev, e) => {
        if (e.correctOrWrong > 0) prev += 1;
        return prev;
    }, 0);

    return (<><h3>{correctNum} / {questions.length}</h3>
        {questions.map((v, i) => {
            if (questions[i].correctOrWrong <= 0) return (<div key={i}>
                <div>{v.Japanese}</div>
                <div>{v.English}</div>
                <p></p>
            </div>)
        })}
    </>)
}