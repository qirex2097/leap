import { render, screen } from '@testing-library/react';
import { Home } from '../routes/Home'
import { QuestionData } from '../questions'

const start = (questions: QuestionData[]): void => {
    return
}

test('', () => {
    render(<Home start={start}/>)

    screen.debug()
})