import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { SectionData, addSectionDataFromFile, QuestionData, getCurrentSectionData, selectQuestions, getSelectedSections } from "../questions";
import { DropQuestions } from '../components/DropQuestions';

type Label = {
    label: string
    checked: boolean
}

export const Home = ({ start }: { start: (newQuestionData: QuestionData[]) => void }): JSX.Element => {
    const sectionData: SectionData[] = getCurrentSectionData();
    const [labels, setLabels] = React.useState<Label[]>(sectionData.map((v, i) => {
        return { label: `${v.start}-${v.end}`, checked: getSelectedSections().includes(i) }
    }));
    let newLabels = [...labels];

    const questionStart = () => {
        const selectedSections: number[] = labels.map((v, i) => {
            if (v.checked) return i;
            else return -1;
        }).filter(v => v >= 0);
        start(selectQuestions(selectedSections));
    }

    const updateLabels = (filename: string, result: string): void => {
        addSectionDataFromFile(filename, result);

        newLabels = getCurrentSectionData().map((v, i) => {
            return { label: `${v.start}-${v.end}`, checked: false }
        })
        setLabels(newLabels);
    }

    const handleChange = (idx: number, checked: boolean) => {
        const newLabels = labels.map((v, i) => {
            if (idx === i) return { ...v, checked: checked }
            else return v;
        })
        setLabels(newLabels);
    }

    const reset = () => {
        setLabels(labels.map((v) => { return { ...v, checked: false } }));
    }

    return (<>
        <Grid container spacing={0}>{
            newLabels.map((v, i) => {
                return <Grid item key={i} xs={1.5}><FormControlLabel
                    key={i}
                    checked={v.checked}
                    control={<Checkbox />}
                    onChange={(event: React.SyntheticEvent, checked: boolean) => handleChange(i, checked)}
                    label={v.label} /></Grid>
            })
        }</Grid>
        <Button onClick={questionStart}>START</Button>
        <Button onClick={reset}>RESET</Button>
        <DropQuestions onLoad={updateLabels} />
    </>);
}