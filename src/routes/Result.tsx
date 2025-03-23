import Button from "@mui/material/Button";
import { QuestionData, getAnswers, divideQuestion } from "../questions";
import { ShowQuestions } from "../components/ShowQuestions";

export const Result = ({
  questions,
  isCorrect,
  retry,
}: {
  questions: QuestionData[];
  isCorrect: boolean[]
  retry: (retryQuestions: QuestionData[]) => void;
}) => {
  const correctNum = isCorrect.reduce((prev, current) => {
    if (current) prev += 1;
    return prev;
  }, 0);

  let wrongQuestions: QuestionData[] = [];
  for (let i = 0; i < isCorrect.length; i++) {
    if (!isCorrect[i]) wrongQuestions.push(questions[i])
  }

  const message: string = wrongQuestions.length === 0 ? "OK" : "RETRY";

  return (
    <>
      <h1>
        {correctNum} / {questions.length}
      </h1>
      <Button onClick={() => retry(wrongQuestions)} autoFocus={true}>
        {message}
      </Button>
      
      {wrongQuestions.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {wrongQuestions.map((question, index) => {
              const parts = divideQuestion(question);
              return (
                <div key={index}>
                  {parts.map((part, partIndex) => (
                    <span key={partIndex} style={{ 
                      fontWeight: partIndex % 2 === 1 ? 'bold' : 'normal',
                      backgroundColor: partIndex % 2 === 1 ? '#ffeeee' : 'transparent'
                    }}>
                      {part}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
