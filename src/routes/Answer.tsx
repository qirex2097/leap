import Button from '@mui/material/Button';
import {QuestionData, divideQuestion} from '../questions';

export const Answers = ({ questions }: { questions: QuestionData[] }) => {
  const correctNum: number = questions.reduce((prev, e) => {
    if (e.correctOrWrong > 0) prev += 1;
    return prev;
  }, 0);

  const wrongQuestions: QuestionData[] = questions.filter((v, i) => {
    if (questions[i].correctOrWrong <= 0) return v;
    else return "";
  });

  return (
    <>
      <h3>
        {correctNum} / {questions.length}
      </h3>
      {wrongQuestions.map((v, i) => {
        const token: string[] = divideQuestion(v)
        const questionLine = token.map((e, i) => {
          if (i % 2 === 0) {
            return <span key={i}>{e}</span>
          } else {
            return <span key={i} style={{borderBottom: "solid 3px red"}}>
              {e}
            </span>
          }
        })

        return (
          <div key={i}>
            <div>
              {v.Japanese} / {v.sectionName}
            </div>
            <div>{questionLine}</div>
            <p></p>
          </div>
        );
      })}
    </>
  );
};

//----------------------------------------

export const Answer = ({ questions, goOn }:
    {
        questions: QuestionData[]
        goOn: () => void
    }) => {

    const correctNum = questions.reduce((prev, current) => {
        if (current.correctOrWrong > 0) prev += 1;
        return prev;
    }, 0);
    if (correctNum === questions.length) {
        goOn();
    }

    return (<>
        <Answers questions={questions} />
        <hr></hr>
        <Button autoFocus={true} onClick={goOn}>CONTINUE</Button>
    </>)
}