import Button from '@mui/material/Button';
import { Answers } from '../components/Questions';

import {QuestionData} from '../questions';

export const Answer = ({ questions, retry }:
    {
        questions: QuestionData[]
        retry: () => void
    }) => {

    return (<>
        <Answers questions={questions} />
        <hr></hr>
        <Button autoFocus={true} onClick={retry}>CONTINUE</Button>
    </>)
}