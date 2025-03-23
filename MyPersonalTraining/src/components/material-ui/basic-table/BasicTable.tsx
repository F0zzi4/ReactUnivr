import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import FirebaseObject from "../../firebase/firestore/data-model/FirebaseObject";

interface BasicTableProps {
  data: FirebaseObject[];
}

const BasicTable: React.FC<BasicTableProps> = ({ data }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>Exercise Name</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>Description</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>Target</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>Difficulty</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row">
                {item.Name}
              </TableCell>
              <TableCell align="right">{item.Description}</TableCell>
              <TableCell align="right">{item.Target}</TableCell>
              <TableCell align="right">{item.Difficulty}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BasicTable;