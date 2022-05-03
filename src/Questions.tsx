import React from 'react';
import Input from '@mui/material/Input';
import InputAdorment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button';
import Check from '@mui/icons-material/Check';
import Clear from '@mui/icons-material/Clear';



const Question = ({ English, Japanese, answer, isCorrect, answerCheck }
    : {
        English: string, Japanese: string, answer: string,
        isCorrect: number,
        answerCheck: (isCorrect: boolean) => void
    }) => {
    const separater: string = answer.match(/[\?\.,:;]$/)?.[0] || ' ';

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const separaterPos: number | undefined = answer.match(separater)?.['index'];
        if (e.target.value.toLowerCase() == answer.toLowerCase() || e.target.value.toLowerCase() + separater == answer.toLowerCase()) {
            answerCheck(true);
            e.target.value = separaterPos ? answer.slice(0, separaterPos) : answer;
        } else {
            answerCheck(false);
        }
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


export const Questions = ({ questions, correctTable, updateCorrectTable }:
    {
        questions: { English: string, Japanese: string, answer: string }[]
        correctTable: number[]
        updateCorrectTable: (idx: number, status: number) => void
    }) => {
    const kazu = questions.length;

    return (<>
        {questions.map((v, i) => {
            return (<Question key={i} {...v}
                isCorrect={correctTable[i]}
                answerCheck={(isCorrect: boolean) => updateCorrectTable(i, isCorrect ? 1 : -1)}
            />);
        })}
        <Button onClick={() => console.log('FINISHED!')}>FINISHED</Button>
        <div>{correctTable.reduce((prev, current) => {
            if (current > 0) prev += 1;
            return prev;
        }, 0)} / {questions.length}</div>
    </>);
}