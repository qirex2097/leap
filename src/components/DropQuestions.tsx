import React from 'react';
import UploadFile from '@mui/icons-material/UploadFile';
import { useDropzone } from "react-dropzone";
import { SectionData } from "../questions";

export const DropQuestions = ({ onLoad }: {
    onLoad: (newSectionData: SectionData) => void
}) => {
    const onDrop = React.useCallback(
        (acceptedFiles: File[]) => {
            for (const f of acceptedFiles) {
                const reader = new FileReader();
                reader.onload = () => {
                    const start: number = parseInt(f.name.match(/([0-9]+)-/)?.[1]!);
                    const end: number = parseInt(f.name.match(/-([0-9]+)/)?.[1]!);
                    let sentences: { English: string, Japanese: string, word: string }[]  = [];
                    if (f.name.search(/\.json$/) >= 0) {
                        sentences = JSON.parse(reader.result as string);
                    } else if (f.name.search(/\.txt$/) >= 0) {
                        const lines: string[] = (reader.result as string).split('\n').filter((v) => v.length > 0);
                        for (let i = 0; i < lines.length; i += 3) {
                            const sentence: {English: string, Japanese: string, word: string} = {
                                English: lines[i + 0],
                                Japanese: lines[i + 1],
                                word: lines[i + 2]
                            }
                            sentences.push(sentence);
                        }
                    }

                    const newSectionData: SectionData = {
                        start: start,
                        end: end,
                        filename: f.name,
                        sentences: sentences
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