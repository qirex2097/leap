//----------------------------------------
import data from './data.json';

type Sentence = {
    English: string,
    Japanese: string,
    word: string,
}

export type SectionData = {
    start: number
    end: number
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

export const getLastQuestionNo = (): number => {
    return currentData[currentData.length - 1].end
}

export const addSectionData = (sentences: Sentence[], start: number, end: number, filename: string = "") => {
    const newStart = start > 0 ? end : getLastQuestionNo() + 1;
    const newEnd = end > 0 ? end : newStart + sentences.length;
    const newSectionData: SectionData = {
        start: newStart,
        end: newEnd,
        filename: filename,
        sentences: sentences
    }

    currentData = [...currentData, newSectionData].sort((a, b) => a.start - b.start); //addSectionData(newSectionData);
}

export const addSectionDataFromFile = (filename: string, result: string) => {
        const start: number = filename.match(/[0-9]+-/) ? parseInt(filename.match(/([0-9]+)-/)?.[1]!) : 0;
        const end: number = filename.match(/-[0-9]+/) ? parseInt(filename.match(/-([0-9]+)/)?.[1]!) : 0;
        let sentences: { English: string, Japanese: string, word: string }[] = [];

        if (filename.search(/\.json$/) >= 0) {
            sentences = JSON.parse(result);
        } else if (filename.search(/\.txt$/) >= 0) {
            const lines: string[] = (result).split(/\r\n|\n|\r/).filter((v) => v.length > 0);
            for (let i = 0; i < lines.length; i += 3) {
                const sentence: { English: string, Japanese: string, word: string } = {
                    English: lines[i + 0],
                    Japanese: lines[i + 1],
                    word: lines[i + 2]
                }
                sentences.push(sentence);
            }
        }

        addSectionData(sentences, start, end, filename);
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
        const section: string = currentData[p].filename ?? `${currentData[p].start} - ${currentData[p].end}`;
        if (p < 0 || currentData.length <= p) continue;
        for (const s of currentData[p].sentences) {
            const answer = getAnswer(s.English, s.word)
            candidateQuestions.push({ ...s, answer: answer, correctOrWrong: 0, wordNo: section });
        }
    }

    return randomlySortQuestions(candidateQuestions);
}
//----------------------------------------
