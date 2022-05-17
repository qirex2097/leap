import Button from '@mui/material/Button';

export const Header = ({ goHome, questionKazu, questionStartNo, questionEndNo }: {
    goHome: () => void
    questionKazu: number
    questionStartNo: number
    questionEndNo: number
}) => {
    const moji: string = `${questionStartNo + 1} - ${questionEndNo + 1} / ${questionKazu}`

    return (<>
        <Button onClick={() => {
            goHome();
        }}>HOME</Button>
        {questionKazu > 0 && moji}
    </>)
}