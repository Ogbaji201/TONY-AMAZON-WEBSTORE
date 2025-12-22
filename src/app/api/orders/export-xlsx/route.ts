// app/api/orders/export-xlsx/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import ExcelJS from "exceljs";

export const runtime = "nodejs"; // required for Buffer + exceljs

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1️⃣ Fetch orders
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 2️⃣ Create workbook & sheet
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "CherryBliss";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Orders");

    // 3️⃣ Define columns
    sheet.columns = [
      { header: "Order ID", key: "id", width: 28 },
      { header: "Customer Name", key: "customerName", width: 22 },
      { header: "Customer Email", key: "customerEmail", width: 28 },
      { header: "Customer Phone", key: "customerPhone", width: 18 },
      { header: "Customer Address", key: "customerAddress", width: 40 },
      { header: "Total Amount", key: "totalAmount", width: 16 },
      { header: "Status", key: "status", width: 14 },
      { header: "Order Date", key: "createdAt", width: 20 },
      { header: "Items Count", key: "itemsCount", width: 14 },
    ];

    // Header styling
    sheet.getRow(1).font = { bold: true };
    sheet.views = [{ state: "frozen", ySplit: 1 }];

    // 4️⃣ Add rows
    for (const order of orders) {
      sheet.addRow({
        id: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        customerAddress: order.customerAddress,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt, // Date object → Excel date
        itemsCount: order.items.length,
      });
    }

    // 5️⃣ Format columns
    sheet.getColumn("totalAmount").numFmt = '#,##0.00'; // numeric currency style
    sheet.getColumn("createdAt").numFmt = "dd/mm/yyyy hh:mm"; // UK-style datetime

    // Optional: enable filters
    sheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: sheet.columns.length },
    };

    // 6️⃣ Generate file
    const buffer = await workbook.xlsx.writeBuffer();

    const filename = `orders-${new Date().toISOString().slice(0, 10)}.xlsx`;

    // 7️⃣ Return download
    return new NextResponse(Buffer.from(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Excel export error:", error);
    return NextResponse.json(
      { error: "Failed to export orders" },
      { status: 500 }
    );
  }
}
