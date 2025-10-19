import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [years] = await db.query(
      `SELECT DISTINCT YEAR(loanstart) AS year
       FROM d_date
       ORDER BY year DESC;`
    );

    const [regions] = await db.query(
      `SELECT DISTINCT name AS region
       FROM d_region
       ORDER BY name ASC;`
    );

    const [districts] = await db.query(
      `SELECT DISTINCT district_name AS district
       FROM d_district
       ORDER BY district_name ASC;`
    );

    const [clients] = await db.query(
      `SELECT DISTINCT client_key AS client
       FROM d_client
       ORDER BY client_key ASC;`
    );

    const [accounts] = await db.query(
      `SELECT DISTINCT account_key AS account
       FROM d_account
       ORDER BY account_key ASC;`
    );

    const [loanstatuses] = await db.query(
      `SELECT DISTINCT description AS loanstatus
       FROM d_loanstatus
       ORDER BY description ASC;`
    );

    /* eslint-disable @typescript-eslint/no-explicit-any */
    return NextResponse.json({
      years: (years as any[]).map((r) => r.year),
      regions: (regions as any[]).map((r) => r.region),
      districts: (districts as any[]).map((r) => r.district),
      clients: (clients as any[]).map((r) => r.client),
      accounts: (accounts as any[]).map((r) => r.account),
      loanstatuses: (loanstatuses as any[]).map((r) => r.loanstatus),
    });
    /* eslint-disable @typescript-eslint/no-explicit-any */
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch database metadata" },
      { status: 500 }
    );
  }
}
