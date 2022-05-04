import { Questions } from '../components/Questions';
import Button from '@mui/material/Button';
import { QuestionData } from '../questions';

//----------------------------------------
export const Question = ({ questions, updateCorrectWrong, finished }:
    {
        questions: QuestionData[]
        updateCorrectWrong: (idx: number, status: number) => void
        finished: () => void
    }) => {

    return (<>
        <Questions questions={questions} updateCorrectWrong={updateCorrectWrong} />
        <hr></hr>
        <Button onClick={finished}>FINISHED</Button>
        {questions.reduce((prev, question) => {
            if (question.correctOrWrong > 0) prev += 1;
            return prev;
        }, 0)} / {questions.length}
    </>)
}