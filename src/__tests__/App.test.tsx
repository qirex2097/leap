import React from 'react';
import { render, screen } from '@testing-library/react';

import { Header } from '../components/Header';

describe('選択できる問題を表示する', () => {
    test('renders App component', () => {
        render(<Header goHome={() => console.log(`goHome`) } questionStartNo={1} questionEndNo={100} questionKazu={100} />);

        screen.debug();
    })
    //
    it.todo('セクションごとにチェックボックスを表示する');
})

export {}