import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { SectionData, QuestionData, getCurrentSectionData, addSectionData, resetLoadedSectionData, getSelectedSections, selectQuestions } from "../questions";
import { DropQuestions } from '../components/DropQuestions';

export const Home = ({start}: {start: (newQuestionData: QuestionData[]) => void}): JSX.Element => {
    const sectionData: SectionData[] = getCurrentSectionData();
    const [checkedTable, setCheckedTable] = React.useState<boolean[]>(sectionData.map((v, i) => {
        if (getSelectedSections().includes(i)) { 
            return true; 
        } else { 
            return false;
        }
    }));
    const [labels, setLabels] = React.useState<string[]>(sectionData.map((v) => {
        return `${v.start}-${v.end}`
    }));
    let newLabels = [...labels];

    const questionStart = () => {
        const selectedSections: number[] = checkedTable.map((v, i) => {
            if (v) return i;
            else return -1;
        }).filter(v => v >= 0);

        start(selectQuestions(selectedSections));
    }

    const handleLoad = (newSectionData: SectionData): void => {
        const newLabel: string = `${newSectionData.start}-${newSectionData.end}`
        addSectionData(newSectionData);
        newLabels = [...newLabels, newLabel];
        setLabels(newLabels);
    }

    const handleChange = (idx: number, checked: boolean) => {
        const newCheckedTable = checkedTable.map((v, i) => {
            if (idx === i) return checked;
            else return v;
        });
        setCheckedTable(newCheckedTable);
    }

    const reset = () => {
        setCheckedTable(checkedTable.map((v) => { return false; }));
    }

    return (<>
        <Grid container spacing={0}>{
            newLabels.map((v, i) => {
                return <Grid item key={i} xs={1.5}><FormControlLabel
                    key={i}
                    checked={checkedTable[i]}
                    control={<Checkbox />}
                    onChange={(event: React.SyntheticEvent, checked: boolean) => handleChange(i, checked)}
                    label={v} /></Grid>
            })
        }</Grid>
        <Button onClick={questionStart}>START</Button>
        <Button onClick={reset}>RESET</Button>
        <DropQuestions questionStart={questionStart} onLoad={handleLoad} />
    </>);
}