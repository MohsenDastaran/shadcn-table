export const copyToClipboard = (users: any) => {
  const tableData = users.map((user: any) => Object.values(user).join("\t")).join("\n");
  navigator.clipboard.writeText(tableData);
  push.success({
    title: "Success",
    message: "Table data copied to clipboard!",
  });
};
export const exportToCSV = (users: any) => {
  const csvContent =
    "data:text/csv;charset=utf-8," +
    users.map((user: any) => Object.values(user).join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "users.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  push.success({
    title: "Success",
    message: "CSV file generated successfully",
  });
};
export const exportToExcel = (users: any) => {
  const tableHTML = `
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>ID</th>
          <th>Order Type</th>
          <th>Phone Number</th>
          <th>Provider Message</th>
          <th>Submission Datetime</th>
        </tr>
      </thead>
      <tbody>
        ${users
          .map(
            (user: any) => `
          <tr>
            <td>${user.first_name}</td>
            <td>${user.id}</td>
            <td>${user.order_type}</td>
            <td>${user.phone_number}</td>
            <td>${user.provider_message}</td>
            <td>${user.submission_datetime}</td>
          </tr>`
          )
          .join("")}
      </tbody>
    </table>
  `;
  const dataType = "application/vnd.ms-excel";
  const blob = new Blob([tableHTML], { type: dataType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "users.xls";
  link.click();
  URL.revokeObjectURL(url);
  push.success({
    title: "Success",
    message: "Excel file generated successfully",
  });
};
export const printTable = (users: any) => {
  const printContent = `
    <html>
      <head>
        <title>Print Table</title>
        <style>
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
          }
        </style>
      </head>
      <body>
        <h1>Users Table</h1>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>ID</th>
              <th>Order Type</th>
              <th>Phone Number</th>
              <th>Provider Message</th>
              <th>Submission Datetime</th>
            </tr>
          </thead>
          <tbody>
            ${users
              .map(
                (user: any) => `
              <tr>
                <td>${user.first_name}</td>
                <td>${user.id}</td>
                <td>${user.order_type}</td>
                <td>${user.phone_number}</td>
                <td>${user.provider_message}</td>
                <td>${user.submission_datetime}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  }
};
