import React from 'react';
import Input from '@mui/material/Input';
import InputAdorment from '@mui/material/InputAdornment'
import Check from '@mui/icons-material/Check';
import Clear from '@mui/icons-material/Clear';

const Question = ({ English, Japanese, answer, isCorrect, answerCheck, showAnswer }
    : {
        English: string, Japanese: string, answer: string,
        isCorrect: number,
        answerCheck: (isCorrect: boolean) => void
        showAnswer: boolean
    }) => {
    const separater: string = answer.match(/[?.,:;]$/)?.[0] || ' ';

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const answer_moji: string = answer.match(/[a-zA-Z\-']+/)?.[0] || '';
        if (e.target.value.toLowerCase() == answer_moji.toLowerCase()) {
            answerCheck(true);
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
            if (showAnswer) {
                return (<span key={i}>
                    <Input type="text" color="secondary"
                        style={{ width: answer.length * 12 + 24 }}
                        value={answer}
                        startAdornment={startAdornment}
                    />
                </span>)
            } else {
                return (<span key={i}>
                    <Input type="text" color='secondary'
                        onBlur={handleBlur}
                        style={{ width: answer.length * 12 + 24 }}
                        startAdornment={startAdornment}
                    />
                    {separater}</span>);
            }
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


export const Questions = ({ questions, correctTable, updateCorrectTable, showAnswer = false }:
    {
        questions: { English: string, Japanese: string, answer: string }[]
        correctTable: number[]
        updateCorrectTable: (idx: number, status: number) => void
        showAnswer?: boolean
    }) => {
    const kazu = questions.length;

    if (showAnswer) {
        return (<>
            {questions.map((v, i) => {
                if (correctTable[i] < 0) {
                    return (<Question key={i} {...v}
                        isCorrect={correctTable[i]}
                        answerCheck={(isCorrect: boolean) => updateCorrectTable(i, isCorrect ? 1 : -1)}
                        showAnswer={showAnswer}
                    />);
                }
            })}
        </>)
    } else {
        return (<>
            {questions.map((v, i) => {
                return (<Question key={i} {...v}
                    isCorrect={correctTable[i]}
                    answerCheck={(isCorrect: boolean) => updateCorrectTable(i, isCorrect ? 1 : -1)}
                    showAnswer={showAnswer}
                />);
            })}
        </>);
    }
}