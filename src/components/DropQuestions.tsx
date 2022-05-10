import React from 'react';
import UploadFile from '@mui/icons-material/UploadFile';
import { useDropzone } from "react-dropzone";
import { SectionData } from "../questions";

export const DropQuestions = ({ questionStart, onLoad }: {
    questionStart: (sections: number[]) => void
    onLoad: (newSectionData: SectionData) => void
}) => {
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
        }, [onLoad])

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