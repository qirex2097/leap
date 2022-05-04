//----------------------------------------
import data from './data.json';

export type QuestionData = {
    English: string
    Japanese: string
    answer: string
    correctOrWrong: number
    wordNo: string
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

export const selectQuestions = (pages: number[]): QuestionData[] => {
    let candidateQuestions: QuestionData[] = [];
    for (const p of pages) {
        const section: string = `${data[p].start} - ${data[p].end}`;
        if (p < 0 || data.length <= p) continue;
        for (const s of data[p].sentences) {
            const answer = getAnswer(s.English, s.word)
            candidateQuestions.push({ ...s, answer: answer, correctOrWrong: 0, wordNo: section });
        }
    }

//    const questionKazu = kazu || Math.min(candidateQuestions.length, 50);
    const questionKazu = candidateQuestions.length;

    let allQuestionNumbers: number[] = Array(candidateQuestions.length).fill(0).map((v, i) => i);
    let questionNumbers: number[] = [];
    while (questionNumbers.length < questionKazu && questionNumbers.length < candidateQuestions.length) {
        const candidateNumbers = allQuestionNumbers.filter((v) => !questionNumbers.includes(v));
        const questionNumber = candidateNumbers[Math.floor(Math.random() * candidateNumbers.length)];
        questionNumbers.push(questionNumber);
    }

    let questions: QuestionData[] = [];
    for (const q of questionNumbers) {
        questions.push(candidateQuestions[q]);
    }
    return questions;
}
//----------------------------------------
