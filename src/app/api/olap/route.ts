import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const dashboard = searchParams.get("dashboard") || "";
    const operation = searchParams.get("operation") || "slice";
    const year = searchParams.get("year");
    const region = searchParams.get("region");
    const district = searchParams.get("district");
    const client = searchParams.get("client");
    const account = searchParams.get("account");
    const loanstatus = searchParams.get("loanstatus");

    let query = "";
    switch (dashboard) {
      case "loans_by_region":
        query = `
          SELECT 
            d_region.name AS region,
            SUM(f_loans.amount) AS total_amount,
            AVG(f_loans.duration) AS avg_duration,
            SUM(f_loans.balance) AS total_balance
          FROM f_loans
          JOIN d_client ON f_loans.client_key = d_client.client_key
          JOIN d_district ON d_client.district_id = d_district.district_id
          JOIN d_region ON d_district.region_id = d_region.region_id
          GROUP BY d_region.name
          ORDER BY d_region.name ASC
        `;
        break;

      case "loans_by_district":
        query = `
          SELECT 
            d_region.name AS region,
            d_district.district_name AS district,
            SUM(f_loans.amount) AS total_amount,
            AVG(f_loans.duration) AS avg_duration,
            SUM(f_loans.balance) AS total_balance
          FROM f_loans
          JOIN d_client ON f_loans.client_key = d_client.client_key
          JOIN d_district ON d_client.district_id = d_district.district_id
          JOIN d_region ON d_district.region_id = d_region.region_id
          GROUP BY d_region.name, d_district.district_name
          ORDER BY d_region.name ASC, d_district.district_name ASC
        `;
        break;

      case "loan_status_slice":
        query = `
          SELECT 
            d_loanstatus.description AS status,
            COUNT(*) AS count_loans,
            SUM(f_loans.balance) AS total_balance,
            AVG(f_loans.payments) AS avg_payments
          FROM f_loans
          JOIN d_loanstatus ON f_loans.status_key = d_loanstatus.loanstatus_id
          GROUP BY d_loanstatus.description
          ORDER BY d_loanstatus.description ASC
        `;
        break;

      case "customer_dice":
        query = `
          SELECT
            d_client.client_key AS customer,
            d_region.name AS region,
            d_account.frequency AS frequency,
            SUM(f_loans.amount) AS total_amount,
            SUM(f_loans.balance) AS total_balance
          FROM f_loans
          JOIN d_client ON f_loans.client_key = d_client.client_key
          JOIN d_district ON d_client.district_id = d_district.district_id
          JOIN d_region ON d_district.region_id = d_region.region_id
          JOIN d_account ON f_loans.account_key = d_account.account_key
          GROUP BY d_client.client_key, d_region.name, d_account.frequency
          ORDER BY d_client.client_key ASC
        `;
        break;

      default:
        query = `
          SELECT 
            YEAR(d_date.loanstart) AS year,
            d_region.name AS region,
            d_district.district_name AS district,
            d_client.client_key AS client,
            d_account.account_id AS account,
            d_loanstatus.description AS loanstatus,
            SUM(f_loans.amount) AS total_amount,
            AVG(f_loans.duration) AS avg_duration,
            AVG(f_loans.payments) AS avg_payment,
            SUM(f_loans.balance) AS total_balance
          FROM f_loans
          JOIN d_account ON f_loans.account_key = d_account.account_key
          JOIN d_client ON f_loans.client_key = d_client.client_key
          JOIN d_date ON f_loans.date_key = d_date.date_key
          JOIN d_district ON d_client.district_id = d_district.district_id
          JOIN d_region ON d_district.region_id = d_region.region_id
          JOIN d_loanstatus ON f_loans.status_key = d_loanstatus.loanstatus_id
          WHERE 1=1
          ${year ? `AND YEAR(d_date.loanstart) = ${db.escape(year)}` : ""}
          ${region ? `AND d_region.name = ${db.escape(region)}` : ""}
          ${district ? `AND d_district.district_name = ${db.escape(district)}` : ""}
          ${client ? `AND d_client.client_key = ${db.escape(client)}` : ""}
          ${account ? `AND d_account.account_id = ${db.escape(account)}` : ""}
          ${loanstatus ? `AND d_loanstatus.description = ${db.escape(loanstatus)}` : ""}
          GROUP BY YEAR(d_date.loanstart), d_region.name, d_district.district_name, d_loanstatus.description
          ORDER BY YEAR(d_date.loanstart) DESC
        `;
        break;
    }

    const [rows] = await db.query(query);
    return NextResponse.json(rows);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("OLAP error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
