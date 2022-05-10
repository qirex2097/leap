import React from 'react';
import { SelectChangeEvent } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { DropQuestions } from './DropQuestions';
import { QuestionData, getPresetSectionInfo, setPresetSectionData, selectQuestions } from '../questions';

let localStartNo: number;
let localEndNo: number;

const Selector = (): JSX.Element => {
    const sections: { start: number, end: number }[] = getPresetSectionInfo();
    const [startNo, setStartNo] = React.useState(0);
    const [endNo, setEndNo] = React.useState(sections.length - 1);
    localStartNo = startNo;
    localEndNo = endNo;

    const handleStartNoChanged = (e: SelectChangeEvent<number>) => {
        const newStartNo = e.target.value as number;
        setStartNo(newStartNo);
        if (endNo < newStartNo) {
            setEndNo(newStartNo);
        }
        localStartNo = startNo;
        localEndNo = endNo;
    }
    const handleEndNoChanged = (e: SelectChangeEvent<number>) => {
        const newEndNo = e.target.value as number;
        setEndNo(newEndNo);
        if (newEndNo < startNo) {
            setStartNo(newEndNo);
        }
        localStartNo = startNo;
        localEndNo = endNo;
    }

    return (<>
        <Select
            value={startNo}
            label="start"
            size="small"
            onChange={handleStartNoChanged}
        >
            {sections.map((v, i) => {
                const moji = `${v.start}`;
                return <MenuItem key={i} value={i}>{moji}</MenuItem>
            })}
        </Select>
        <> - </>
        <Select
            value={endNo}
            label="end"
            size="small"
            onChange={handleEndNoChanged}
        >
            {sections.map((v, i) => {
                const moji = `${v.end}`;
                return <MenuItem key={i} value={i}>{moji}</MenuItem>
            })}
        </Select>
    </>);
}

export const SelectQuestions = ({ onSelect, goHome, isShowDropQuestions }: {
    onSelect: (newQuestions: QuestionData[]) => void
    goHome: () => void
    isShowDropQuestions?: boolean
}) => {
    const [showDropQuestions, setShowDropQuestions] = React.useState<boolean>(true);

    if (isShowDropQuestions) {
        setShowDropQuestions(true);
    }

    const questionStart = (sections: number[]) => {
        const newQuestions = selectQuestions(sections);
        onSelect(newQuestions);
        setShowDropQuestions(false);
    }

    return (<>
        <Selector />
        <Button onClick={() => {
            const sections: number[] = new Array(localEndNo - localStartNo + 1).fill(localStartNo).map((v, i) => v + i);
            setPresetSectionData();
            questionStart(sections);
        }}>START</Button>
        <Button onClick={() => {
            goHome();
            setShowDropQuestions(true);
        }}>HOME</Button>
        {showDropQuestions && <>
            <hr></hr>
            <DropQuestions questionStart={questionStart} />
        </>}
    </>)
}