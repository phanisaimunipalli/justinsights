import React, { Fragment, useState } from "react";
import Message from "./Message";
import Progress from "./Progress";
import axios from "axios";
import "../App.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

const FileUpload = () => {
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose File");
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [result, setResult] = useState([]);

  function createData(
    CustomerId,
    MonthYear,
    MinBalance,
    MaxBalance,
    EndingBalance
  ) {
    return { CustomerId, MonthYear, MinBalance, MaxBalance, EndingBalance };
  }

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const fileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );
          setTimeout(() => setUploadPercentage(0), 10000);
        },
      });

      console.log("res: ", res);
      console.log("res: ", res.data);
      const { fileName, filePath } = res.data;
      console.log("res.data.result: ", res.data.result);
      // setResult(res.data.result);
      let rows = [];
      const resultData = res.data.result;
      console.log("resultData: ", resultData);
      for (var key of Object.keys(resultData)) {
        console.log(key + " -> " + resultData[key]);
        console.log(resultData[key].minBalance);
        rows.push(
          createData(
            resultData[key].cid,
            "11/2022",
            resultData[key].minBalance,
            resultData[key].maxBalance,
            resultData[key].endingBalance
          )
        );
      }
      console.log("total rows: ", rows);
      setResult(rows);
      setUploadedFile({ fileName, filePath });
      setMessage("File uploaded");
    } catch (err) {
      if (err.response.status === 500) {
        setMessage("There was a problem witht the server");
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };

  return (
    <Fragment>
      {message ? <Message msg={message} /> : null}
      <form onSubmit={fileUpload}>
        <div className="custom-file mb-4">
          <input
            type="file"
            className="custom-file-input"
            id="customFile"
            onChange={onChange}
          />
          <label className="custom-file-label" htmlFor="customFile">
            {filename}
          </label>
        </div>

        <Progress percentage={uploadPercentage} />

        <input
          type="submit"
          value="Upload"
          className="btn btn-primary btn-block mt-4"
        />
      </form>
      {uploadedFile && result ? (
        <>
          <div className="row mt-5">
            <h3 className="text-center">{uploadedFile.fileName}</h3>
            <img style={{ width: "100%" }} src={uploadedFile.filePath} alt="" />
            {/* {console.log("rows before render: ", result)} */}
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>CustomerId</StyledTableCell>
                    <StyledTableCell align="right">MM/YYYY</StyledTableCell>
                    <StyledTableCell align="right">MinBalance</StyledTableCell>
                    <StyledTableCell align="right">MaxBalance</StyledTableCell>
                    <StyledTableCell align="right">
                      EndingBalance
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.map((row) => (
                    <StyledTableRow
                      key={row.CustomerId}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {row.CustomerId}
                      </TableCell>
                      {/* <TableCell align="right">{row.CustomerId}</TableCell> */}
                      <StyledTableCell align="right">
                        {row.MonthYear}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.MinBalance}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.MaxBalance}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.EndingBalance}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <br></br>
            <p className="textCenter">
              Note: MaxBalance and EndingBalance at the beginning of the month
              are considered as 0 but minBalance is taken as the Day 1 Balance.
            </p>
          </div>
        </>
      ) : null}
    </Fragment>
  );
};

export default FileUpload;
