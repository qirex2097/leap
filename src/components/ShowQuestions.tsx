import TextareaAutosize from "@mui/base/TextareaAutosize";
import Button from "@mui/material/Button";
import { QuestionData, divideQuestion } from "../questions";

export const ShowQuestions = ({ questions }: { questions: QuestionData[] }) => {
    let value: string = "";

    for (const q of questions) {
        const token: string[] = divideQuestion(q)
        let eng = '';
        for (let i = 0; i < token.length; i++) {
            if (i % 2 === 1) {
                eng = eng + '>>>' + token[i] + '<<<'
            } else {
                eng = eng + token[i];
            }
        }

        value += `${eng}\n${q.Japanese}\n\n`
    }

    return (<div>
        <TextareaAutosize
            maxRows={40}
            value={value}
            style={{ width: "100%" }}
        />
    </div>);
}
