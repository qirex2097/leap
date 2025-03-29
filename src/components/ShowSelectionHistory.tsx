import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

type SectionHistory = {
  sectionName: string;
  count: number;
};

interface ShowSelectionHistoryProps {
  selectionCounts: Record<number, number>;
  sectionNames: string[];
}

export const ShowSelectionHistory: React.FC<ShowSelectionHistoryProps> = ({
  selectionCounts,
  sectionNames,
}) => {
  // セクション名と選択回数の配列を作成
  const sectionHistory: SectionHistory[] = sectionNames.map((name, index) => ({
    sectionName: name,
    count: selectionCounts[index] || 0,
  }));

  // 選択回数が0のセクションも含めて表示
  const sortedHistory = [...sectionHistory].sort((a, b) => b.count - a.count);

  return (
    <Box sx={{ marginTop: 3 }}>
      <Typography variant="h6" component="h3" gutterBottom>
        問題の選択履歴
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>セクション名</TableCell>
              <TableCell align="right">選択回数</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedHistory.map((item: SectionHistory, index: number) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {item.sectionName}
                </TableCell>
                <TableCell align="right">{item.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
