import { Questions } from '../components/Questions';
import Button from '@mui/material/Button';

//----------------------------------------
export const Contact = ({ questions, correctTable, updateCorrectTable, finished }:
    {
        questions: { English: string, Japanese: string, answer: string }[], correctTable: number[],
        updateCorrectTable: (idx: number, status: number) => void
        finished: () => void
    }) => {

    return (<>
        <Questions questions={questions} correctTable={correctTable} updateCorrectTable={updateCorrectTable} />
        <hr></hr>
        <Button onClick={finished}>FINISHED</Button>
        {correctTable.reduce((prev, current) => {
            if (current > 0) prev += 1;
            return prev;
        }, 0)} / {questions.length}
    </>)
}