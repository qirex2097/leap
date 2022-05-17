import TextareaAutosize from "@mui/base/TextareaAutosize";
import Button from "@mui/material/Button";
import { QuestionData } from "../questions";

export const ShowQuestions = ({ questions }: { questions: QuestionData[] }) => {
    let value: string = "";

    for (const q of questions) {
        value += `${q.English}\n${q.Japanese}\n${q.answer.toLowerCase()}\n\n`
    }

    return (<div>
        <TextareaAutosize
            maxRows={40}
            value={value}
            style={{ width: "100%" }}
        />
        <Button onClick={() => navigator.clipboard.writeText(value)}>COPY</Button>
    </div>);
}