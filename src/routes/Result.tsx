import { QuestionData } from '../questions';

export const Result = ({ questions }: { questions: QuestionData[] }) => {
    const correctNum  = questions.reduce((prev, current) => {
        if (current.correctOrWrong > 0) prev += 1;
        return prev;
    }, 0);
    return <h1> {correctNum} / {questions.length}</h1>
}