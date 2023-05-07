// React components
import React, { useState } from "react";

// Styling components
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import GetAppIcon from "@material-ui/icons/GetApp";

// Common utils and actions
import domtoimage from "dom-to-image";
import JsPDF from "jspdf";
import { CSVLink } from "react-csv";

const styles = {
  paperProps: {
    style: {
      maxHeight: 48 * 4.5,
      width: 150,
    },
  },
  button: {
    width: "100px",
    height: "40px",
    marginBottom: "10px",
  },
};

const iconButton = "exportIconButton";
const filter = (node) => node.id !== iconButton;

//#region Region for exporting to image
const exportToImage = async (chart, format, exportFunc) => {
  try {
    const dataUrl = await exportFunc(chart, { filter });
    const link = document.createElement("a");
    document.body.appendChild(link);
    link.download = `chart.${format}`;
    link.href = dataUrl;
    link.click();
    link.remove();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("oops, something went wrong!", err);
  }
};
const exportToJpeg = (chart) => exportToImage(chart, "jpeg", domtoimage.toJpeg);
const exportToPng = (chart) => exportToImage(chart, "png", domtoimage.toPng);
//#endregion

//#region Region for exporting to PDF
const exportToPdf = async (chart) => {
  const width = chart.offsetWidth;
  const height = chart.offsetHeight;
  try {
    const dataUrl = await domtoimage.toJpeg(chart, { filter });
    // @ts-ignore
    const doc = new JsPDF({
      orientation: "landscape",
      unit: "px",
      format: [width, height],
    });
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = doc.internal.pageSize.getHeight();
    doc.addImage(dataUrl, "JPEG", 0, 0, pdfWidth, pdfHeight);
    doc.save("chart");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("oops, something went wrong!", err);
  }
};
//#endregion

//#region Region for printing
const print = async (chart) => {
  try {
    const dataUrl = await domtoimage.toJpeg(chart, { filter });
    let html = `<html><head><title></title></head>`;
    html += `<body style="width: 100%; padding: 0; margin: 0;"`;
    html += ` onload="window.focus(); window.print(); window.close()">`;
    html += `<img src="${dataUrl}" /></body></html>`;

    const printWindow = window.open("", "print");
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("oops, something went wrong!", err);
  }
};
//#endregion

// Export options definition
const exportOptions = [
  { key: "Print", action: print, text: "Print" },
  { key: "JPEG", action: exportToJpeg, text: "Save as JPEG" },
  { key: "PNG", action: exportToPng, text: "Save as PNG" },
  { key: "PDF", action: exportToPdf, text: "Save as PDF" },
];

//#region Region for the Export button functionality
const ExportChart = (props) => {
  // State handling for this function
  const [anchorEl, setAnchorEl] = useState(null);
  const { chartContainer } = props;
  const open = Boolean(anchorEl);

  // Custom event listeners
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = ({ action }) => {
    return () => {
      const chart = document.querySelector(`#${chartContainer}`);
      handleClose();
      action(chart);
    };
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        id={iconButton}
        onClick={handleClick}
        style={{ margin: "30px" }}
      >
        <GetAppIcon />
        Export
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={styles.paperProps}
      >
        {exportOptions.map((option) => (
          <MenuItem key={option.key} onClick={handleExport(option)}>
            {option.text}
          </MenuItem>
        ))}
        <MenuItem key={4}>
          <CSVLink
            data={props.data}
            style={{ textDecoration: "none", color: "inherit" }}
            onClick={handleClose}
          >
            Save as CSV
          </CSVLink>
        </MenuItem>
      </Menu>
    </>
  );
};
//#endregion

export default ExportChart;
