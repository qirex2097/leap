//----------------------------------------
import data from './data.json';

export type QuestionData = {
    English: string
    Japanese: string
    answer: string
    correctOrWrong: number
}

const getAnswer = (English: string, word: string): string => {
    let answer: string = "";
    for (const w of English.split(' ')) {
        if (w.toLowerCase().search(word) >= 0) {
            answer = w;
        }
    }

    return answer;
}

export const selectQuestions = (pages: number[], kazu: number = 10): QuestionData[] => {
    let candidateQuestions: { English: string, Japanese: string, word: string }[] = []
    for (const p of pages) {
        if (p < 0 || data.length <= p) continue;
        candidateQuestions = [...candidateQuestions, ...data[p].sentences]
    }
    let allQuestionNumbers: number[] = Array(candidateQuestions.length).fill(0).map((v, i) => i);
    let questionNumbers: number[] = [];
    while (questionNumbers.length < kazu && questionNumbers.length < candidateQuestions.length) {
        const candidateNumbers = allQuestionNumbers.filter((v) => !questionNumbers.includes(v));
        const questionNumber = candidateNumbers[Math.floor(Math.random() * candidateNumbers.length)];
        questionNumbers.push(questionNumber);
    }

    let questions: QuestionData[] = [];
    for (const q of questionNumbers) {
        const sentence = candidateQuestions[q];
        const answer = getAnswer(sentence.English, sentence.word);
        questions.push({ correctOrWrong: 0, ...candidateQuestions[q], answer });
    }
    return questions;
}
//----------------------------------------
