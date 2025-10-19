import { useState, useEffect } from "react";
import {
  IoTime,
  IoDownload,
  IoSearch,
  IoArrowDown,
  IoArrowUp,
} from "react-icons/io5";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ActivityLogModule = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    setTimeout(() => {
      // Dummy data for demonstration
      setActivities([
        {
          id: 1,
          action: "User login",
          target: "john@example.com",
          adminUser: "Admin User",
          timestamp: new Date().toISOString(),
          type: "auth",
          details: "Successful login from IP 192.168.1.100",
        },
        {
          id: 2,
          action: "Item approved",
          target: "Gaming Laptop #123",
          adminUser: "Admin User",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          type: "item",
          details: "Item reviewed and approved for listing",
        },
        {
          id: 3,
          action: "User verification approved",
          target: "jane@example.com",
          adminUser: "System",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          type: "verification",
          details: "Identity documents verified successfully",
        },
        {
          id: 4,
          action: "User suspended",
          target: "violator@example.com",
          adminUser: "Admin User",
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          type: "user",
          details: "Suspended for 7 days due to policy violation",
        },
        {
          id: 5,
          action: "Payment processed",
          target: "Rental #456",
          adminUser: "System",
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          type: "payment",
          details: "Payment of ₱1,500 processed successfully",
        },
        {
          id: 6,
          action: "Report dismissed",
          target: "Item Report #789",
          adminUser: "Admin User",
          timestamp: new Date(Date.now() - 18000000).toISOString(),
          type: "report",
          details: "Report reviewed and dismissed as invalid",
        },
        {
          id: 7,
          action: "User banned",
          target: "spammer@example.com",
          adminUser: "Admin User",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          type: "user",
          details: "Permanent ban for repeated violations",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filtered = activities.filter(
    (a) =>
      a.action.toLowerCase().includes(search.toLowerCase()) ||
      a.target.toLowerCase().includes(search.toLowerCase()) ||
      a.adminUser.toLowerCase().includes(search.toLowerCase()) ||
      a.details.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (sortBy === "timestamp") {
      valA = new Date(valA);
      valB = new Date(valB);
    }
    if (valA < valB) return sortDir === "asc" ? -1 : 1;
    if (valA > valB) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(sorted);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ActivityLog");
    XLSX.writeFile(wb, "activity_log.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Activity Log", 14, 16);
    doc.autoTable({
      head: [["Action", "Target", "Admin", "Date", "Details"]],
      body: sorted.map((a) => [
        a.action,
        a.target,
        a.adminUser,
        new Date(a.timestamp).toLocaleString(),
        a.details,
      ]),
      startY: 22,
    });
    doc.save("activity_log.pdf");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex gap-2 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search activity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] text-sm"
            />
            <IoSearch className="absolute right-2 top-2.5 text-gray-400 w-4 h-4" />
          </div>
          <button
            onClick={exportToExcel}
            className="px-3 py-2 bg-green-600 text-white rounded-md text-xs hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2"
          >
            <IoDownload className="w-4 h-4" /> Excel
          </button>
          <button
            onClick={exportToPDF}
            className="px-3 py-2 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center gap-2"
          >
            <IoDownload className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                className="px-3 py-2 cursor-pointer text-left font-medium text-gray-500 uppercase tracking-wider"
                onClick={() => handleSort("action")}
              >
                Action{" "}
                {sortBy === "action" &&
                  (sortDir === "asc" ? (
                    <IoArrowUp className="inline w-3 h-3" />
                  ) : (
                    <IoArrowDown className="inline w-3 h-3" />
                  ))}
              </th>
              <th
                className="px-3 py-2 cursor-pointer text-left font-medium text-gray-500 uppercase tracking-wider"
                onClick={() => handleSort("target")}
              >
                Target{" "}
                {sortBy === "target" &&
                  (sortDir === "asc" ? (
                    <IoArrowUp className="inline w-3 h-3" />
                  ) : (
                    <IoArrowDown className="inline w-3 h-3" />
                  ))}
              </th>
              <th
                className="px-3 py-2 cursor-pointer text-left font-medium text-gray-500 uppercase tracking-wider"
                onClick={() => handleSort("adminUser")}
              >
                Admin{" "}
                {sortBy === "adminUser" &&
                  (sortDir === "asc" ? (
                    <IoArrowUp className="inline w-3 h-3" />
                  ) : (
                    <IoArrowDown className="inline w-3 h-3" />
                  ))}
              </th>
              <th
                className="px-3 py-2 cursor-pointer text-left font-medium text-gray-500 uppercase tracking-wider"
                onClick={() => handleSort("timestamp")}
              >
                Date{" "}
                {sortBy === "timestamp" &&
                  (sortDir === "asc" ? (
                    <IoArrowUp className="inline w-3 h-3" />
                  ) : (
                    <IoArrowDown className="inline w-3 h-3" />
                  ))}
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-[#6C4BF4] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Loading activity log...</p>
                </td>
              </tr>
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  <IoTime className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  No activity found.
                </td>
              </tr>
            ) : (
              sorted.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-900">
                    {a.action}
                  </td>
                  <td className="px-3 py-2">{a.target}</td>
                  <td className="px-3 py-2">{a.adminUser}</td>
                  <td className="px-3 py-2">
                    {new Date(a.timestamp).toLocaleString()}
                  </td>
                  <td className="px-3 py-2">{a.details}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLogModule;
