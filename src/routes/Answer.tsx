import Button from '@mui/material/Button';
import { Answers } from '../components/Questions';

import {QuestionData} from '../questions';

export const Answer = ({ questions, goOn }:
    {
        questions: QuestionData[]
        goOn: () => void
    }) => {

    return (<>
        <Answers questions={questions} />
        <hr></hr>
        <Button autoFocus={true} onClick={goOn}>CONTINUE</Button>
    </>)
}