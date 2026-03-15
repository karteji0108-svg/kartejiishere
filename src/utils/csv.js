// Basic CSV export function (using existing logic, or a simple mock if the app does not have it globally exported)
export const exportToCSV = (data, filename) => {
  if (!data || !data.length) return;
  const keys = Object.keys(data[0]);
  const csvContent = "data:text/csv;charset=utf-8," +
    keys.join(",") + "\n" +
    data.map(row => keys.map(k => `"${row[k]}"`).join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
