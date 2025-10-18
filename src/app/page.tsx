"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Metadata = {
  years: string[];
  regions: string[];
  districts: string[];
  clients: string[];
  accounts: string[];
  loanstatuses: string[];
};

export default function Home() {
  const [metadata, setMetadata] = useState<Metadata>({
    years: [], regions: [], districts: [], clients: [], accounts: [], loanstatuses: []
  });
  const [dbMessage, setDbMessage] = useState<string>("");

  const [filters, setFilters] = useState({
    year: "", region: "", district: "", client: "", account: "", loanstatus: ""
  });
  const [reportData, setReportData] = useState<any[]>([]);
  const [loadingReport, setLoadingReport] = useState(false);

  const [loansByRegion, setLoansByRegion] = useState<any[]>([]);
  const [loansByDistrict, setLoansByDistrict] = useState<any[]>([]);
  const [loanStatusSlice, setLoanStatusSlice] = useState<any[]>([]);
  const [customerDice, setCustomerDice] = useState<any[]>([]);
  const [loadingDashboards, setLoadingDashboards] = useState(false);

  useEffect(() => {
    fetch("/api/database")
      .then(res => res.json())
      .then(data => {
        if (data) setMetadata(data);
        setDbMessage("Connected to database successfully.");
      })
      .catch(err => setDbMessage(`Failed to connect: ${err}`));
  }, []);

  // dashboards
  const fetchDashboards = async () => {
    setLoadingDashboards(true);
    try {
      const [r1, r2, r3, r4] = await Promise.all([
        fetch("/api/olap?dashboard=loans_by_region&operation=rollup").then(r => r.json()),
        fetch("/api/olap?dashboard=loans_by_district&operation=drilldown").then(r => r.json()),
        fetch("/api/olap?dashboard=loan_status_slice&operation=slice").then(r => r.json()),
        fetch("/api/olap?dashboard=customer_dice&operation=dice").then(r => r.json())
      ]);
      setLoansByRegion(r1);
      setLoansByDistrict(r2);
      setLoanStatusSlice(r3);
      setCustomerDice(r4);
    } catch (err) {
      console.error("Error fetching dashboards:", err);
    } finally {
      setLoadingDashboards(false);
    }
  };

  useEffect(() => { fetchDashboards(); }, []);

  // for the report table
  const handleGenerate = async () => {
    setLoadingReport(true);
    try {
      const params = new URLSearchParams({ ...filters }).toString();
      const res = await fetch(`/api/olap?${params}`);
      const data = await res.json();
      setReportData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReport(false);
    }
  };
  
  // for show all /clear filter button
  const handleShowAll = async () => {
    setFilters({ year: "", region: "", district: "", client: "", account: "", loanstatus: "" });
    setLoadingReport(true);
    try {
      const res = await fetch("/api/olap");
      const data = await res.json();
      setReportData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReport(false);
    }
  };

  const renderTable = (data: any[], columns: string[], loading = false) => (
    <div className="overflow-auto max-h-[250px] border rounded shadow p-2 bg-white">
      <Table className="w-full min-w-[600px]">
        <TableHeader>
          <TableRow>{columns.map(c => <TableHead key={c}>{c}</TableHead>)}</TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-gray-400">Loading...</TableCell>
            </TableRow>
          ) : data.length ? (
            data.map((row, i) => (
              <TableRow key={i}>
                {columns.map(col => (
                  <TableCell key={col} className={(col.includes("Total") || col.includes("Avg") || col.includes("Amount") ? "text-right" : "")}>
                    {row[col.toLowerCase().replace(/\s/g, "_")]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-gray-400">No data</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="font-sans min-h-screen p-10 bg-gray-50">
      <main className="flex flex-col items-center gap-6 w-full">
        <p className="text-sm text-gray-500">{dbMessage}</p>

        <Button onClick={fetchDashboards} className="mb-4">Refresh Dashboards</Button>

        <div className="flex flex-col gap-8 w-full">

          <div>
            <h2 className="text-xl font-bold mb-2">Loans by Region (Roll-up)</h2>
            {renderTable(loansByRegion, ["Region", "Total Amount", "Avg Duration", "Total Balance"], loadingDashboards)}
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Loans by District (Drill-down)</h2>
            {renderTable(loansByDistrict, ["Region", "District", "Total Amount", "Avg Duration", "Total Balance"], loadingDashboards)}
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Loan Status (Slice)</h2>
            {renderTable(loanStatusSlice, ["Status", "Count Loans", "Total Balance", "Avg Payments"], loadingDashboards)}
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Customer (Dice)</h2>
            {renderTable(customerDice, ["Customer", "Region", "Frequency", "Total Amount", "Total Balance"], loadingDashboards)}
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full mt-10">
          <div className="flex w-full justify-between items-center flex-wrap gap-4">
            <Button onClick={handleGenerate} disabled={loadingReport}>Generate Report</Button>
            <Button variant="outline" onClick={handleShowAll} disabled={loadingReport}>Show All / Clear Filters</Button>
          </div>

          <div className="flex flex-wrap gap-2 w-full justify-center mt-2">
            <Select onValueChange={v => setFilters({ ...filters, year: v })}>
              <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
              <SelectContent>{metadata.years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
            </Select>

            <Select onValueChange={v => setFilters({ ...filters, region: v })}>
              <SelectTrigger><SelectValue placeholder="Region" /></SelectTrigger>
              <SelectContent>{metadata.regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>

            <Select onValueChange={v => setFilters({ ...filters, district: v })}>
              <SelectTrigger><SelectValue placeholder="District" /></SelectTrigger>
              <SelectContent>{metadata.districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>

            <Select onValueChange={v => setFilters({ ...filters, client: v })}>
              <SelectTrigger><SelectValue placeholder="Client" /></SelectTrigger>
              <SelectContent>{metadata.clients.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>

            <Select onValueChange={v => setFilters({ ...filters, account: v })}>
              <SelectTrigger><SelectValue placeholder="Account" /></SelectTrigger>
              <SelectContent>{metadata.accounts.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
            </Select>

            <Select onValueChange={v => setFilters({ ...filters, loanstatus: v })}>
              <SelectTrigger><SelectValue placeholder="Loan Status" /></SelectTrigger>
              <SelectContent>{metadata.loanstatuses.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          {renderTable(reportData, ["Year", "Region", "District", "Loan Status", "Total Amount"], loadingReport)}
        </div>

      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center mt-6">
        <a className="flex items-center gap-2 hover:underline" href="#" target="_blank">
          <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
          Technical Report
        </a>
        |
        <p className="flex items-center gap-2 hover:underline">
          <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
          STADVDB MCO1 Group 2
        </p>
      </footer>
    </div>
  );
}
