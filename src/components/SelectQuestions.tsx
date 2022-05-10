import Button from '@mui/material/Button';

export const SelectQuestions = ({ goHome, questionKazu, questionStartNo, questionEndNo }: {
    goHome: () => void
    questionKazu: number
    questionStartNo: number
    questionEndNo: number
}) => {
    const moji: string = `${questionStartNo + 1} - ${questionEndNo + 1} / ${questionKazu}`

    return (<>
        {}
        {questionKazu > 0 && moji}
        <Button onClick={() => {
            goHome();
        }}>HOME</Button>
    </>)
}