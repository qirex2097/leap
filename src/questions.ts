//----------------------------------------
import data from './data.json';

type Sentence = {
    English: string,
    Japanese: string,
    word: string,
}

export type SectionData = {
    filename?: string
    sentences: Sentence[]
}

export type QuestionData = {
    English: string
    Japanese: string
    answer: string
    correctOrWrong: number
    wordNo: string
}

//----------------------------------------

let currentData: SectionData[] = [...data];
let selectedSections: number[] = [];

export const getCurrentSectionData = (): SectionData[] => {
    return currentData;
}

export const resetLoadedSectionData = () => {
    currentData = [...data];
}

export const getSelectedSections = (): number[] => {
    return selectedSections;
}

export const addSectionData = (sentences: Sentence[], filename: string = "") => {
    const newSectionData: SectionData = {
        filename: filename,
        sentences: sentences
    }

    currentData = [...currentData, newSectionData].sort((a, b) => { return a.filename! < b.filename! ? -1 : 1 });
}

export const addSectionDataFromFile = (filename: string, result: string) => {
    let sentences: { English: string, Japanese: string, word: string }[] = [];

    if (filename.search(/\.json$/) >= 0) {
        sentences = JSON.parse(result);
    } else if (filename.search(/\.txt$/) >= 0) {
        const lines: string[] = (result).split(/\r\n|\n|\r/).filter((v) => v.length > 0);
        for (let i = 0; i < lines.length; i += 3) {
            const sentence: Sentence = {
                English: lines[i + 0],
                Japanese: lines[i + 1],
                word: lines[i + 2]
            }
            if (sentence.word && getAnswer(sentence.English, sentence.word).length > 0) {
                sentences.push(sentence);
            } else {
                console.log(`addSectionDataFromFile: ${sentence.English}, ${sentence.word}`);
            }
        }
    }

    addSectionData(sentences, filename.substring(0, filename.indexOf('.')));
}
//----------------------------------------

const getAnswer = (English: string, word: string): string => {
    let answer: string = "";
    for (const w of English.split(' ')) {
        if (w.toLowerCase().search(word.toLowerCase()) >= 0) {
            answer = w;
        }
    }

    return answer;
}

export const randomlySortQuestions = (candidateQuestions: QuestionData[]): QuestionData[] => {
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

export const selectQuestions = (pages: number[]): QuestionData[] => {
    if (pages.length === 0) pages = new Array(currentData.length).fill(0).map((v, i) => i);
    selectedSections = pages;

    let candidateQuestions: QuestionData[] = [];
    for (const p of pages) {
        const section: string = currentData[p].filename ?? `xxx`;
        if (p < 0 || currentData.length <= p) continue;
        for (const s of currentData[p].sentences) {
            const answer = getAnswer(s.English, s.word)
            candidateQuestions.push({ ...s, answer: answer, correctOrWrong: 0, wordNo: section });
        }
    }

    return randomlySortQuestions(candidateQuestions);
}
//----------------------------------------
