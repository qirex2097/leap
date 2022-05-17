import Button from '@mui/material/Button';
import { QuestionData } from '../questions';
import { ShowQuestions } from '../components/ShowQuestions';


export const Result = ({ questions, retry }: { questions: QuestionData[], retry: (retryList: number[]) => void }) => {
    const correctNum = questions.reduce((prev, current) => {
        if (current.correctOrWrong > 0) prev += 1;
        return prev;
    }, 0);

    let retryList: number[] = [];
    for (const q of questions) {
        if (q.correctOrWrong <= 0) retryList.push(questions.indexOf(q));
    }

    let wrongQuestions: QuestionData[] = [];
    for (const q of retryList) {
        wrongQuestions.push(questions[q]);
    }

    const message: string = retryList.length === 0 ? 'OK' : 'RETRY'

    return (<>
        <h1>{correctNum} / {questions.length}</h1>
        <Button onClick={() => retry(retryList)} autoFocus={true}>{message}</Button>
        {retryList.length !== 0 && <ShowQuestions questions={wrongQuestions}/>}
    </>);
}