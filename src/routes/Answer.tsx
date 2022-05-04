import Button from '@mui/material/Button';
import { Answers } from '../components/Questions';

import {QuestionData} from '../questions';

export const About = ({ questions, retry, gohome }:
    {
        questions: QuestionData[]
        retry: () => void
        gohome: () => void
    }) => {

    return (<>
        <Answers questions={questions} />
        <hr></hr>
        <Button autoFocus={true} onClick={retry}>RETRY</Button>
        <Button onClick={gohome}>HOME</Button>
    </>)
}