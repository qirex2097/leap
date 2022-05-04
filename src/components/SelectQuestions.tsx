import React from 'react';
import { SelectChangeEvent } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

import data from '../data.json';

export const SelectQuestions = ({ onSelect }: { onSelect: (startNo: number, endNo: number) => void }) => {
    const [startNo, setStartNo] = React.useState(0);
    const [endNo, setEndNo] = React.useState(data.length - 1);

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

    return (<>
        <Select
            value={startNo}
            label="start"
            size="small"
            onChange={handleStartNoChanged}
        >
            {data.map((v, i) => {
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
            {data.map((v, i) => {
                const moji = `${v.end}`;
                return <MenuItem key={i} value={i}>{moji}</MenuItem>
            })}
        </Select>
        <Button onClick={() => { onSelect(startNo, endNo) }}>START</Button>
    </>)
}
