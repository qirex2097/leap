import Button from '@mui/material/Button';
import { Answers } from '../components/Questions';

export const About = ({ questions, correctTable, retry, gohome }:
    {
        questions: { English: string, Japanese: string, answer: string }[], correctTable: number[],
        retry: () => void
        gohome: () => void
    }) => {

    return (<>
        <Answers questions={questions} correctTable={correctTable} />
        <hr></hr>
        <Button autoFocus={true} onClick={retry}>RETRY</Button>
        <Button onClick={gohome}>HOME</Button>
    </>)
}