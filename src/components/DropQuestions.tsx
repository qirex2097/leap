import React from 'react';
import UploadFile from '@mui/icons-material/UploadFile';
import { useDropzone } from "react-dropzone";

export const DropQuestions = ({ onLoad }: {
    onLoad: (filename: string, result: string, group: string) => void
}) => {
    const onDropAccepted = React.useCallback(
        (acceptedFiles: File[]) => {
            const groupName: string = acceptedFiles.length > 0 ? acceptedFiles[0].name : 'FILES'
            for (const f of acceptedFiles) {
                if (f.name.match(/^\./)) continue;
                const reader = new FileReader();
                reader.onload = () => { onLoad(f.name, reader.result as string, groupName); }
                reader.readAsText(f);
            }
        }, [onLoad])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDropAccepted, accept: { 'text/plane': ['.txt']} })
    const centeringStyles = { position: "absolute", top: "50%", left: "50%", transform: "translateY(-50%) translateX(-50%)" }

    return <>
        <div {...getRootProps()} style={{
            border: "1px dotted", height: 150,
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