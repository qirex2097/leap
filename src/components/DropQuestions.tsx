import React from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import UploadFile from '@mui/icons-material/UploadFile';
import { useDropzone } from "react-dropzone";
import { SectionData, addLoadedSectionData, getLoadedSectionData, setLoadedSectionData, resetLoadedSectionData, getSelectedSections } from "../questions";

export const DropQuestions = ({ questionStart }: {
    questionStart: (sections: number[]) => void
}) => {
    const [checkedTable, setCheckedTable] = React.useState<boolean[]>(Array(getLoadedSectionData().length).fill(false).map((v, i) => {
        if (getSelectedSections().includes(i)) return true; else return false;
    }));
    const [sectionData, setSectionData] = React.useState<SectionData[]>(getLoadedSectionData());

    const updateCheckedTable = (idx: number, checked: boolean) => {
        let newCheckedTable: boolean[] = Array(getLoadedSectionData().length).fill(true).map((v, i) => {
            if (idx === i) {
                return checked;
            } else if (i < checkedTable.length) {
                return checkedTable[i];
            } else {
                return false;
            }
        })
        setCheckedTable(newCheckedTable);
    }
    const onDrop = React.useCallback(
        (acceptedFiles: File[]) => {
            for (const f of acceptedFiles) {
                const reader = new FileReader();
                reader.onload = () => {
                    const start: number = parseInt(f.name.match(/([0-9]+)-/)?.[1]!);
                    const end: number = parseInt(f.name.match(/-([0-9]+)/)?.[1]!);

                    const newSectionData: SectionData = {
                        start: start,
                        end: end,
                        filename: f.name,
                        sentences: JSON.parse(reader.result as string)
                    }
                    addLoadedSectionData(newSectionData);
                    setSectionData(getLoadedSectionData());
                    if (checkedTable.length < getLoadedSectionData().length) {
                        setCheckedTable([...checkedTable, ...Array(getLoadedSectionData().length - checkedTable.length).fill(false)]);
                    }
                }
                reader.readAsText(f);
            }
        }, [checkedTable])

    const reset = () => {
        resetLoadedSectionData();
        setSectionData([])
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
    const centeringStyles = { position: "absolute", top: "50%", left: "50%", transform: "translateY(-50%) translateX(-50%)" }

    return <>
        <div {...getRootProps()} style={{
            border: "1px dotted", width: 300, height: 150,
            position: "relative"
        }}>
            <input {...getInputProps()} />
            {isDragActive ? (
                <UploadFile sx={{
                    fontSize: 64,
                    ...centeringStyles
                }} />
            ) : (
                <UploadFile sx={{
                    fontSize: 40,
                    ...centeringStyles
                }} />
            )}
        </div>
        <FormGroup>{
            sectionData.map((v, i) => {
                return <FormControlLabel
                    key={i}
                    checked={checkedTable[i]}
                    control={<Checkbox />}
                    onChange={(event: React.SyntheticEvent, checked: boolean) => {
                        updateCheckedTable(i, checked);
                    }}
                    label={v.filename} />
            })
        }</FormGroup>
        <Button onClick={() => {
            const sections: number[] = [];
            for (let i = 0; i < sectionData.length; i++) {
                if (checkedTable[i]) {
                    sections.push(i);
                }
            }
            if (sections.length > 0) {
                setLoadedSectionData();
                questionStart(sections as number[]);
            }
        }}>START</Button>
        <Button onClick={reset}>RESET</Button>
    </>
}