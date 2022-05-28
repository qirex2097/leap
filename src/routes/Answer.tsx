import Button from '@mui/material/Button';
import { Answers } from '../components/Questions';

import {QuestionData} from '../questions';

export const Answer = ({ questions, goOn }:
    {
        questions: QuestionData[]
        goOn: () => void
    }) => {

    const correctNum = questions.reduce((prev, current) => {
        if (current.correctOrWrong > 0) prev += 1;
        return prev;
    }, 0);
    if (correctNum === questions.length) {
        goOn();
    }

    return (<>
        <Answers questions={questions} />
        <hr></hr>
        <Button autoFocus={true} onClick={goOn}>CONTINUE</Button>
    </>)
}