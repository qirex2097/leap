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
    group?: string
}

const QuestionList = ({ labels, handleChange }: { 
    labels: Label[]
    handleChange: (idx: number, checked: boolean) => void
 }): JSX.Element => {
    const yoko: number = window.innerWidth > 750 ? 8 : 4;
    type localLabel = Label & {
        idx: number
    }
    const localLabels: localLabel[] = labels.map((v, i) => { return { ...v, idx: i }})
    const labels0: localLabel[] = localLabels.filter((v) => { return v.group ? false : true });
    const labels1: localLabel[] = localLabels.filter((v) => { return v.group ? true : false });
    return (<>
        <details>
            <summary>LEAP</summary>
            <Grid container spacing={0}>{
                labels0.map((v) => {
                    return <Grid item key={v.idx} xs={12 / yoko}><FormControlLabel
                        key={v.idx}
                        checked={v.checked}
                        control={<Checkbox />}
                        onChange={(event: React.SyntheticEvent, checked: boolean) => handleChange(v.idx, checked)}
                        label={v.label} /></Grid>
                })
            }</Grid>
        </details>
        <Grid container spacing={0}>{
            labels1.map((v) => {
                return <Grid item key={v.idx} xs={12 / yoko}><FormControlLabel
                    key={v.idx}
                    checked={v.checked}
                    control={<Checkbox />}
                    onChange={(event: React.SyntheticEvent, checked: boolean) => handleChange(v.idx, checked)}
                    label={v.label} /></Grid>
            })
        }</Grid>
    </>)
}

export const Home = ({ start }: { start: (newQuestionData: QuestionData[]) => void }): JSX.Element => {
    const sectionData: SectionData[] = getCurrentSectionData();
    const [labels, setLabels] = React.useState<Label[]>(sectionData.map((v, i) => {
        const filename = v.filename || 'xxx';
        return { label: `${filename}`, checked: getSelectedSections().includes(i), group: v.group }
    }));
    let newLabels = [...labels];

    const questionStart = () => {
        const selectedSections: number[] = labels.map((v, i) => {
            if (v.checked) return i;
            else return -1;
        }).filter(v => v >= 0);
        start(selectQuestions(selectedSections));
    }

    const updateLabels = (filename: string, result: string, group: string): void => {
        addSectionDataFromFile(filename, result, group);

        newLabels = getCurrentSectionData().map((v, i) => {
            return { label: `${v.filename}`, checked: false, group: v.group }
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

    const yoko: number = window.innerWidth > 750 ? 8 : 4;
    return (<>
        <QuestionList labels={newLabels} handleChange={handleChange} />
        <Button onClick={questionStart}>START</Button>
        <Button onClick={reset}>RESET</Button>
        <DropQuestions onLoad={updateLabels} />
    </>);
}