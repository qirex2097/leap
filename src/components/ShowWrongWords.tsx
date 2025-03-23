import React from "react";
import { QuestionData, getAnswers } from "../questions";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

export const ShowWrongWords = ({ questions }: { questions: QuestionData[] }) => {
  // 問題ごとに単語をグループ化
  const groupedWords = questions.map((question) => {
    const answers = getAnswers(question);
    return {
      words: answers,
      japanese: question.Japanese,
      sectionName: question.sectionName,
      english: question.English
    };
  });

  return (
    <Box sx={{ marginTop: 2 }}>
      <Typography variant="h6" component="h3" gutterBottom>
        間違えた単語一覧
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {groupedWords.map((group, groupIndex) => (
          <Paper 
            key={groupIndex} 
            elevation={1} 
            sx={{ 
              padding: 2, 
              backgroundColor: 'rgba(255, 235, 235, 0.3)',
              border: '1px solid rgba(255, 0, 0, 0.1)'
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {group.japanese} ({group.sectionName})
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {group.words.map((word, wordIndex) => (
                <Chip
                  key={wordIndex}
                  label={word}
                  color="error"
                  variant="outlined"
                  sx={{ margin: '4px' }}
                />
              ))}
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};
