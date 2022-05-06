//----------------------------------------
import data from './data.json';

type SectionData = {
    start: number
    end: number
    sentences: 
        {
            English: string,
            Japanese: string,
            word: string
        }[]
}

export type QuestionData = {
    English: string
    Japanese: string
    answer: string
    correctOrWrong: number
    wordNo: string
}

//----------------------------------------

let currentData: SectionData[] = data;

export const sectionKazu: number = currentData.length;
export const getSectionInfo = (): { start: number, end: number }[] => {
    const sectionInfo: { start: number, end: number }[] = [];

    for (let i = 0; i < currentData.length; i++) {
        sectionInfo.push({ start: currentData[i].start, end: currentData[i].end })
    }

    return sectionInfo;
}

//----------------------------------------

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
        const section: string = `${currentData[p].start} - ${currentData[p].end}`;
        if (p < 0 || currentData.length <= p) continue;
        for (const s of currentData[p].sentences) {
            const answer = getAnswer(s.English, s.word)
            candidateQuestions.push({ ...s, answer: answer, correctOrWrong: 0, wordNo: section });
        }
    }

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
