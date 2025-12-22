// // app/api/orders/export/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function GET(request: NextRequest) {
//   try {
//     const orders = await prisma.order.findMany({
//       include: {
//         items: true,
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });

//     // Convert to CSV format
//     const csvHeaders = [
//       'Order ID',
//       'Customer Name',
//       'Customer Email', 
//       'Customer Phone',
//       'Customer Address',
//       'Total Amount',
//       'Status',
//       'Order Date',
//       'Items Count'
//     ].join(',');

//     const csvRows = orders.map(order => [
//       order.id,
//       `"${order.customerName.replace(/"/g, '""')}"`,
//       order.customerEmail,
//       order.customerPhone,
//       `"${order.customerAddress.replace(/"/g, '""')}"`,
//       order.totalAmount,
//       order.status,
//       new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
//       order.items.length
//     ].join(','));

//     const csv = [csvHeaders, ...csvRows].join('\n');

//     // Return as downloadable file
//     return new NextResponse(csv, {
//       headers: {
//         'Content-Type': 'text/csv',
//         'Content-Disposition': `attachment; filename="orders-${new Date().toISOString().split('T')[0]}.csv"`,
//       },
//     });
//   } catch (error) {
//     console.error('Error exporting orders:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// app/api/orders/export/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const runtime = "nodejs"; // ensure Buffer + node libs work

const prisma = new PrismaClient();

// Prevent CSV/Excel injection + make CSV safe
function sanitizeForCsv(value: unknown): string {
  if (value === null || value === undefined) return "";

  let s = String(value);

  // Normalize newlines (Excel can choke on raw CR/LF in CSV cells)
  s = s.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Prevent formula injection in Excel
  // If a cell starts with = + - @, Excel may treat it as a formula
  if (/^[=+\-@]/.test(s)) s = `'${s}`;

  // Escape quotes for CSV and wrap in quotes always (most Excel-proof)
  s = s.replace(/"/g, '""');
  return `"${s}"`;
}

function formatDateForExcel(d: Date): string {
  // Excel-friendly, human-readable (UK)
  // Example: 19/11/2025 14:12
  return new Date(d).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).replace(",", ""); // remove comma to be extra safe in some locales
}

export async function GET(_request: NextRequest) {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "Order ID",
      "Customer Name",
      "Customer Email",
      "Customer Phone",
      "Customer Address",
      "Total Amount",
      "Status",
      "Order Date",
      "Items Count",
    ].map(sanitizeForCsv).join(",");

    const rows = orders.map((order) => {
      const orderDate = formatDateForExcel(order.createdAt);

      return [
        order.id,
        order.customerName,
        order.customerEmail,
        order.customerPhone,
        order.customerAddress,
        // Keep as number-looking text (but quoted) to avoid Excel weirdness with floats
        // If you want it as a true number in Excel, use .xlsx export below.
        order.totalAmount,
        order.status,
        orderDate,
        order.items.length,
      ].map(sanitizeForCsv).join(",");
    });

    // UTF-8 BOM helps Excel display special characters correctly
    const bom = "\ufeff";
    const csv = bom + [headers, ...rows].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="orders-${new Date()
          .toISOString()
          .slice(0, 10)}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error exporting orders CSV:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
