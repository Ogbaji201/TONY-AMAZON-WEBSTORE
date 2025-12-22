import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import ExcelJS from "exceljs";
import { Resend } from "resend";

export const runtime = "nodejs";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { toEmail } = await req.json();

    if (!toEmail) {
      return NextResponse.json({ error: "toEmail is required" }, { status: 400 });
    }

    // 1) Pull from DB
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    // 2) Build Excel in memory
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Orders");

    sheet.columns = [
      { header: "Order ID", key: "id", width: 28 },
      { header: "Customer Name", key: "customerName", width: 22 },
      { header: "Customer Email", key: "customerEmail", width: 28 },
      { header: "Customer Phone", key: "customerPhone", width: 18 },
      { header: "Customer Address", key: "customerAddress", width: 40 },
      { header: "Total Amount", key: "totalAmount", width: 14 },
      { header: "Status", key: "status", width: 14 },
      { header: "Order Date", key: "createdAt", width: 18 },
      { header: "Items Count", key: "itemsCount", width: 12 },
    ];

    sheet.getRow(1).font = { bold: true };
    sheet.views = [{ state: "frozen", ySplit: 1 }];

    for (const order of orders) {
      sheet.addRow({
        id: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        customerAddress: order.customerAddress,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        itemsCount: order.items.length,
      });
    }

    sheet.getColumn("totalAmount").numFmt = "#,##0.00";
    sheet.getColumn("createdAt").numFmt = "dd/mm/yyyy hh:mm";

    const xlsxBuffer = await workbook.xlsx.writeBuffer();

    // 3) Send via Resend as attachment (base64)
    const filename = `orders-${new Date().toISOString().slice(0, 10)}.xlsx`;

    const { data, error } = await resend.emails.send({
      from: "CherryBliss <hello@cheryblisshealth.com>",
      to: [toEmail],
      subject: `Orders export (${new Date().toISOString().slice(0, 10)})`,
      html: `<p>Attached is your latest Orders export.</p>`,
      attachments: [
        {
          filename,
          content: Buffer.from(xlsxBuffer).toString("base64"),
        },
      ],
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, emailId: data?.id });
  } catch (err) {
    console.error("Email export error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
