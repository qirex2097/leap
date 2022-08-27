//----------------------------------------
import data from './data.json';

type Sentence = {
    English: string,
    Japanese: string,
    word: string,
}

export type SectionData = {
    sentences: Sentence[]
    filename?: string
    group?: string
}

export type QuestionData = {
    English: string
    Japanese: string
    answer: string
    correctOrWrong: number
    wordNo: string
}

//----------------------------------------

const getParagraphs = (lines: string[]): string[] => {
    const paragraphs = [];
    let currentParagraph = '';
    let lineKazu = 0;
    for (const line of lines) {
        if (line.length === 0 || lineKazu >= 3) {
            if (currentParagraph.length > 0) {
                paragraphs.push(currentParagraph)
            }
            currentParagraph = '';
            lineKazu = 0;
        } else {
            currentParagraph = currentParagraph.length > 0 ? currentParagraph + '\n' + line : line;
            lineKazu++;
        }
    }

    if (currentParagraph.length > 0) {
        paragraphs.push(currentParagraph);
    }

    return paragraphs;
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

export const addSectionData = (sentences: Sentence[], filename: string = "", group: string) => {
    const newSectionData: SectionData = {
        sentences: sentences,
        filename: filename,
        group: group
    }

    currentData = [...currentData, newSectionData].sort((a, b) => { return a.filename! < b.filename! ? -1 : 1 });
}

export const addSectionDataFromFile = (filename: string, result: string, group: string) => {
    let sentences: { English: string, Japanese: string, word: string }[] = [];

    if (filename.search(/\.json$/) >= 0) {
        sentences = JSON.parse(result);
    } else if (filename.search(/\.txt$/) >= 0) {
        const paragraphs: string[] = getParagraphs(result.split(/\r\n|\n|\r/))
        for (const para of paragraphs) {
            const [eng, jpn, word]: string[] = para.split('\n')
            if (word && getAnswer(eng, word).length > 0) {
                sentences.push({English: eng, Japanese: jpn, word: word});
            } else {
                console.log(`addSectionDataFromFile: ${eng}, ${word}`);
            }
        }
    }

    addSectionData(sentences, filename.substring(0, filename.indexOf('.')), group);
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
