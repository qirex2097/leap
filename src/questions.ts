//----------------------------------------
type Sentence = {
  English: string;
  Japanese: string;
  answerPosition: number[][];
};

export type SectionData = {
  sentences: Sentence[];
  filename?: string;
  group: string;
};

export type QuestionData = {
  English: string;
  Japanese: string;
  answerPosition: number[][];
  sectionName: string;
};
//----------------------------------------
const divideQuestionLocal = (
  eng: string,
  answerPosition: number[][]
): string[] => {
  let token: string[] = [];

  let prev: number = 0;
  for (const answer of answerPosition) {
    token.push(eng.substring(prev, answer[0]));
    token.push(eng.substring(answer[0], answer[1]));
    prev = answer[1];
  }
  token.push(eng.substring(prev));

  return token;
};
export const divideQuestion = (question: QuestionData): string[] => {
  return divideQuestionLocal(question.English, question.answerPosition);
};
export const getAnswers = (question: QuestionData): string[] => {
  const eng = question.English;
  const answerPosition = question.answerPosition;
  let token: string[] = [];
  for (const answer of answerPosition) {
    token.push(eng.substring(answer[0], answer[1]));
  }
  return token;
};

const searchAnswersFromQuestion = (
  buff: string
): { question: string; answerPosition: number[][] } => {
  let question: string = buff.replace(/>>+|<<+/g, "");
  let answerPosition: number[][] = [];

  let y = 0;
  let deletedChar: number[] = [];
  for (let x = 0; x < buff.length; x++) {
    if (buff.charAt(x) === question.charAt(y)) {
      y += 1;
    } else if (deletedChar.indexOf(y) < 0) {
      deletedChar.push(y);
    }
  }

  for (let i = 0; i < deletedChar.length; i += 2) {
    const [p0, p1]: number[] = [deletedChar[i], deletedChar[i + 1]];
    const answerMoji = question.substring(p0, p1);

    if (answerMoji.indexOf(" ") < 0) {
      answerPosition.push([p0, p1]);
    } else {
      let prev = p0;
      for (const word of answerMoji.split(" ")) {
        answerPosition.push([prev, prev + word.length]);
        prev += word.length + 1;
      }
    }
  }

  return { question, answerPosition };
};

const getParagraphs = (lines: string[]): string[] => {
  const paragraphs: string[] = [];
  const separater = "\n";
  let currentParagraph = "";
  let lineKazu = 0;
  for (const line of lines) {
    if (line.length === 0 || lineKazu >= 3) {
      if (currentParagraph.length > 0) {
        paragraphs.push(currentParagraph);
      }
      currentParagraph = "";
      lineKazu = 0;
      if (line.length > 0) {
        currentParagraph = line;
        lineKazu = 1;
      }
    } else {
      currentParagraph =
        currentParagraph.length > 0
          ? currentParagraph + separater + line
          : line;
      lineKazu++;
    }
  }

  if (currentParagraph.length > 0) {
    paragraphs.push(currentParagraph);
  }

  return paragraphs;
};

const getAnswer = (English: string, word: string): string => {
  let answer: string = "";
  for (const w of English.split(" ")) {
    if (w.toLowerCase().search(word.toLowerCase()) >= 0) {
      answer = w;
    }
  }

  return answer;
};

const getSentences = (text: string): Sentence[] => {
  let sentences: Sentence[] = [];

  const paragraphs: string[] = getParagraphs(text.split(/\r\n|\n|\r/));
  for (const para of paragraphs) {
    const [eng, jpn, word]: string[] = para.split("\n");
    if (word) {
      const answer: string = getAnswer(eng, word);
      if (answer.length > 0) {
        const p0: number = eng.search(answer);
        const p1: number = p0 + answer.length;
        sentences.push({
          English: eng,
          Japanese: jpn,
          answerPosition: [[p0, p1]],
        });
      } else {
        console.log(`getSentences: ${eng}, ${word}`);
      }
    } else {
      const { question, answerPosition } = searchAnswersFromQuestion(eng);

      sentences.push({
        English: question,
        Japanese: jpn,
        answerPosition: answerPosition,
      });
    }
  }

  return sentences;
};
//----------------------------------------

let currentData: SectionData[] = [];
let selectedSections: number[] = [];

export const getCurrentSectionData = (): SectionData[] => {
  return currentData;
};

export const getSelectedSections = (): number[] => {
  return selectedSections;
};

export const addSectionDataFromFile = (
  filename: string,
  result: string,
  group: string
) => {
  if (filename.search(/\.txt$/) >= 0) {
    const sentences = getSentences(result);

    const newSectionData: SectionData = {
      sentences: sentences,
      filename: filename.substring(0, filename.indexOf(".")),
      group: group,
    };

    currentData = [...currentData, newSectionData].sort((a, b) => {
      return a.filename! < b.filename! ? -1 : 1;
    });
  }
};
//----------------------------------------

export const randomlySortQuestions = (
  candidateQuestions: QuestionData[]
): QuestionData[] => {
  const questionKazu = candidateQuestions.length;

  let allQuestionNumbers: number[] = Array(candidateQuestions.length)
    .fill(0)
    .map((v, i) => i);
  let questionNumbers: number[] = [];
  while (
    questionNumbers.length < questionKazu &&
    questionNumbers.length < candidateQuestions.length
  ) {
    const candidateNumbers = allQuestionNumbers.filter(
      (v) => !questionNumbers.includes(v)
    );
    const questionNumber =
      candidateNumbers[Math.floor(Math.random() * candidateNumbers.length)];
    questionNumbers.push(questionNumber);
  }

  let questions: QuestionData[] = [];
  for (const q of questionNumbers) {
    questions.push(candidateQuestions[q]);
  }
  return questions;
};

export const selectQuestions = (pages: number[]): QuestionData[] => {
  if (pages.length === 0)
    pages = new Array(currentData.length).fill(0).map((v, i) => i);
  selectedSections = pages;

  let candidateQuestions: QuestionData[] = [];
  for (const p of pages) {
    const section: string = currentData[p].filename ?? `xxx`;
    if (p < 0 || currentData.length <= p) continue;
    for (const s of currentData[p].sentences) {
      candidateQuestions.push({
        ...s,
        sectionName: section,
      });
    }
  }

  return randomlySortQuestions(candidateQuestions);
};
//----------------------------------------
export const __local__ = {
  getParagraphs,
  searchAnswersFromQuestion,
  divideQuestionLocal,
};
