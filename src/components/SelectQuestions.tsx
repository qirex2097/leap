import React from 'react';
import { SelectChangeEvent } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

import { sectionKazu, getSectionInfo } from '../questions';

export const SelectQuestions = ({ onSelect }: { onSelect: (startNo: number, endNo: number) => void }) => {
    const [startNo, setStartNo] = React.useState(0);
    const [endNo, setEndNo] = React.useState(sectionKazu - 1);

    const handleStartNoChanged = (e: SelectChangeEvent<number>) => {
        const newStartNo = e.target.value as number;
        setStartNo(newStartNo);
        if (endNo < newStartNo) {
            setEndNo(newStartNo);
        }
    }
    const handleEndNoChanged = (e: SelectChangeEvent<number>) => {
        const newEndNo = e.target.value as number;
        setEndNo(newEndNo);
        if (newEndNo < startNo) {
            setStartNo(newEndNo);
        }
    }

    const sections: {start: number, end: number}[] = getSectionInfo();

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
        <Button onClick={() => { onSelect(startNo, endNo) }}>START</Button>
    </>)
}
