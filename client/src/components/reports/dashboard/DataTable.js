import MUIDataTable from "mui-datatables";

const options = {
  responsive: "standard",
  selectableRows: "none",
  sortFilterList: true,
};

const DataTable = ({ data, columns }) => {
  return (
    <MUIDataTable title={""} data={data} columns={columns} options={options} />
  );
};

export default DataTable;
