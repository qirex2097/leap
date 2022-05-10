import React from 'react';
import UploadFile from '@mui/icons-material/UploadFile';
import { useDropzone } from "react-dropzone";
import { SectionData, getSelectedSections, getCurrentSectionData } from "../questions";

export const DropQuestions = ({ questionStart, onLoad }: {
    questionStart: (sections: number[]) => void
    onLoad: (newSectionData: SectionData) => void
}) => {
    const [checkedTable, setCheckedTable] = React.useState<boolean[]>(Array(getCurrentSectionData().length).fill(false).map((v, i) => {
        if (getSelectedSections().includes(i)) return true; else return false;
    }));

    const updateCheckedTable = (idx: number, checked: boolean) => {
        let newCheckedTable: boolean[] = Array(getCurrentSectionData().length).fill(true).map((v, i) => {
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
                    onLoad(newSectionData);
                }
                reader.readAsText(f);
            }
        }, [checkedTable])

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
    </>
}
/*
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
        */
        /*
        <Button onClick={() => {
            const sections: number[] = [];
            for (let i = 0; i < getCurrentSectionData.length; i++) {
                if (checkedTable[i]) {
                    sections.push(i);
                }
            }
            if (sections.length > 0) {
                questionStart(sections as number[]);
            }
        }}>START</Button>
        */
       /*
                    addLoadedSectionData(newSectionData);
                    if (checkedTable.length < getCurrentSectionData().length) {
                        setCheckedTable([...checkedTable, ...Array(getCurrentSectionData().length - checkedTable.length).fill(false)]);
                    }
                    */