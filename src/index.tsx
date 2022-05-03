import ReactDOMClient from 'react-dom/client';
import { App } from './components/App';

import { BrowserRouter } from 'react-router-dom';

const container = document.getElementById('root')!;
const root = ReactDOMClient.createRoot(container);
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);