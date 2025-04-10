import { __local__, QuestionData, divideQuestion } from '../questions'

const data: string[] = [
"The student took the class of modern philosophy just for fun.",/* 0 */
"その学生は単に楽しみのために現代哲学の授業を取った。",
"philosophy",
"",
"Most mammals including human beings can maintain their body temperature naturally.",/* 1 */
"人間を含むたいていの哺乳動物は自然に体温を保つことができる。",
"mammals",
"",
"Burning jet fuel releases quantities of carbon dioxide.",/* 2 */
"ジェット燃料の燃焼は大量の二酸化炭素を放出する。",
"quantities",
"",
"The colorful flowers add much beauty to the rural landscape.",/* 3 */
"色彩豊かな花々が田舎の風景に多くの美を添える。",
"landscape",
"For Native American tribes, lacrosse games are major events.",/* 4 */
"アメリカ先住民の部族にとって, ラクロスの試合は大きな行事である。",
"tribes",
"",
"",
"The brain is the most advanced organ in the known universe.",/* 5 */
"脳は既知の宇宙において最も進歩した器官である。",
"organ",
"",
"",
"Singapore has started the world's first public >>trial<< of the robo-taxi service.",/* 6 */
"シンガポールはロボットタクシー運行業務の世界初の公開試験を始めた。",
"",
"You are expected to adapt to changes in social >>norms.<<",/* 7 */
"社会規範の変化に順応することが求められている。",
"",
"Singapore has started the world's first public **trial** of the robo-taxi service.",/* 6 */
"シンガポールはロボットタクシー運行業務の世界初の公開試験を始めた。",
"",
"You are expected to adapt to changes in social **norms.**",/* 8 */
"社会規範の変化に順応することが求められている。",
];

test('getParagraphs', () => {
    const paragraphs = __local__.getParagraphs(data);
    expect(paragraphs.length).toBe(10);
    expect(paragraphs[0].split('\n').length).toBe(3);
    expect(paragraphs[1].split('\n').length).toBe(3);
    expect(paragraphs[2].split('\n').length).toBe(3);
    expect(paragraphs[3].split('\n').length).toBe(3);
    expect(paragraphs[4].split('\n').length).toBe(3);
    expect(paragraphs[5].split('\n').length).toBe(3);
    expect(paragraphs[6].split('\n').length).toBe(2);
    expect(paragraphs[7].split('\n').length).toBe(2);
    expect(paragraphs[8].split('\n').length).toBe(2);
    expect(paragraphs[9].split('\n').length).toBe(2);
})

test('searchAnswersFromQuestion', () => {
    const eng = "You are expected to adapt to changes in social >>norms.<<"
    const {question, answerPosition} = __local__.searchAnswersFromQuestion(eng);

    expect(question).toBe("You are expected to adapt to changes in social norms.");
    expect(answerPosition[0][0]).toBe(47);
    expect(answerPosition[0][1]).toBe(53);
    expect(question.substring(47,53)).toBe('norms.');
})

test('searchAnswersFromQuestion 2', () => {
    const eng = "The police >>carried out<< a search of the crime scene."
    const {question, answerPosition} = __local__.searchAnswersFromQuestion(eng);
    
    expect(question).toBe("The police carried out a search of the crime scene.");
    expect(answerPosition[0][0]).toBe(11);
    expect(answerPosition[0][1]).toBe(18);
    expect(answerPosition[1][0]).toBe(19);
    expect(answerPosition[1][1]).toBe(22);
})

test('searchAnswersFromQuestion 3', () => {
    const eng = ">>>Turn off the TV<<< and concentrate on your homework."
    const {question, answerPosition} = __local__.searchAnswersFromQuestion(eng);
    
    expect(question).toBe("Turn off the TV and concentrate on your homework.")
    expect(question.substring(answerPosition[0][0], answerPosition[0][1])).toBe('Turn')
    expect(question.substring(answerPosition[1][0], answerPosition[1][1])).toBe('off')
    expect(question.substring(answerPosition[2][0], answerPosition[2][1])).toBe('the')
    expect(question.substring(answerPosition[3][0], answerPosition[3][1])).toBe('TV')
})

test('searchAnswersFromQuestion 4', () => {
    const eng = ">>>Turn<<< >>>off<<< the TV and concentrate on your homework."
    const {question, answerPosition} = __local__.searchAnswersFromQuestion(eng);

    expect(question).toBe("Turn off the TV and concentrate on your homework.")
    expect(question.substring(answerPosition[0][0], answerPosition[0][1])).toBe('Turn')
    expect(question.substring(answerPosition[1][0], answerPosition[1][1])).toBe('off')
})

test('divideQuestion', () => {
    const eng = "The police >>carried out<< a search of the crime scene."
    const {question, answerPosition} = __local__.searchAnswersFromQuestion(eng);
    const questionData: QuestionData = {
        English: question,
        Japanese: "dummy",
        answerPosition: answerPosition,
        sectionName: 'TEST',
    }
    const token = divideQuestion(questionData)

    expect(token.length).toBe(5);
    expect(token.join('')).toBe(question);
})
