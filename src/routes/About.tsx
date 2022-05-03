import Button from '@mui/material/Button';
import { Questions } from '../Questions';

export const About = ({ questions, correctTable, retry, select }:
    {
        questions: { English: string, Japanese: string, answer: string }[], correctTable: number[],
        retry: () => void
        select: () => void
    }) => {

    const updateCorrectTable = (idx: number, status: number) => {
        console.log(`About: updateCorrectTable: ${idx} ${status}`);
    }

    return (<>
        <hr></hr>
        <Questions questions={questions} correctTable={correctTable} updateCorrectTable={updateCorrectTable} showAnswer={true}/>
        <hr></hr>
        <Button onClick={retry}>RETRY</Button>
        <Button onClick={select}>SELECT</Button>
    </>)
}