// app/api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { customer, order, items } = await request.json();

    console.log('📧 Email API called with:', {
      customerEmail: customer?.email,
      orderId: order?.id,
      itemCount: items?.length
    });

    // Validate required fields
    if (!customer?.email || !customer?.name || !order?.id) {
      console.error('Missing required fields for email');
      return NextResponse.json(
        { error: 'Missing required customer or order information' },
        { status: 400 }
      );
    }

    // Calculate totals
    const itemsTotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const shipping = itemsTotal > 25000 ? 0 : 1500;
    const tax = itemsTotal * 0.075;
    const finalTotal = itemsTotal + shipping + tax;

    console.log('💰 Calculated totals:', { itemsTotal, shipping, tax, finalTotal });

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: 'Arial', sans-serif; 
              line-height: 1.6; 
              color: #333; 
              margin: 0; 
              padding: 0; 
              background-color: #f9fafb;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: white;
            }
            .header { 
              background: #2563eb; 
              color: white; 
              padding: 30px 20px; 
              text-align: center; 
            }
            .header h1 { 
              margin: 0; 
              font-size: 28px; 
              font-weight: bold;  
            }
            .content { 
              padding: 30px; 
            }
            .order-details { 
              background: #f8fafc; 
              padding: 25px; 
              border-radius: 8px; 
              margin: 20px 0; 
              border-left: 4px solid #2563eb;
            }
            .order-item { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 10px; 
              padding-bottom: 10px;
              border-bottom: 1px solid #e5e7eb;
            }
            .total-section { 
              background: white; 
              padding: 20px; 
              border-radius: 8px; 
              margin-top: 20px;
              border: 1px solid #e5e7eb;
            }
            .footer { 
              text-align: center; 
              padding: 30px; 
              color: #6b7280; 
              background: #f9fafb;
              border-top: 1px solid #e5e7eb;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛍️ CherryBliss</h1>
              <h2>Order Confirmation</h2>
            </div>
            
            <div class="content">
              <p>Dear <strong>${customer.name}</strong>,</p>
              <p style="color: #059669; font-size: 18px; font-weight: bold;">
                Thank you for your order! We're excited to let you know that we've received your order and it is now being processed.
              </p>
              
              <div style="background: #dbeafe; padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: bold; color: #1e40af; margin: 10px 0;">
                Order #${order.id.slice(-8).toUpperCase()}
              </div>

              <div class="order-details">
                <h3 style="margin-top: 0; color: #1e40af;">📦 Order Details</h3>
                ${items.map((item: any) => `
                  <div class="order-item">
                    <div>
                      <strong>${item.name}</strong><br>
                      <small>Quantity: ${item.quantity} × ₦${item.price.toLocaleString()}</small>
                    </div>
                    <div style="font-weight: bold;">
                      ₦${(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                `).join('')}
              </div>

              <div class="total-section">
                <h3 style="margin-top: 0; color: #1e40af;">💰 Order Summary</h3>
                <div class="order-item">
                  <div>Items Total (${items.reduce((sum: number, item: any) => sum + item.quantity, 0)} items)</div>
                  <div>₦${itemsTotal.toLocaleString()}</div>
                </div>
                <div class="order-item">
                  <div>Shipping</div>
                  <div>${shipping === 0 ? 'FREE' : `₦${shipping.toLocaleString()}`}</div>
                </div>
                <div class="order-item">
                  <div>Tax (7.5%)</div>
                  <div>₦${tax.toLocaleString()}</div>
                </div>
                <div class="order-item" style="font-size: 18px; font-weight: bold; border-top: 2px solid #2563eb; padding-top: 15px;">
                  <div>Total Amount</div>
                  <div>₦${finalTotal.toLocaleString()}</div>
                </div>
              </div>

              <p style="margin-top: 25px;">
                <strong>Next Steps:</strong><br>
                You will receive another email when your order ships. If you have any questions, please reply to this email.
              </p>
            </div>
            
            <div class="footer">
              <p style="margin: 0;">Thank you for shopping with <strong>CherryBliss</strong>! 🎉</p>
              <p style="margin: 10px 0 0 0; font-size: 14px;">
                Premium products for your health and wellness
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log('📤 Sending email via Resend...');

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'CherryBliss <health@cheryblisshealth.com>',
      to: [customer.email],
      subject: `Order Confirmed #${order.id.slice(-8).toUpperCase()} - CheryBliss`,
      html: emailHtml,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      return NextResponse.json({ 
        success: false,
        error: 'Failed to send email',
        details: error 
      }, { status: 500 });
    }

    console.log('✅ Email sent successfully to:', customer.email);
    console.log('📨 Email ID:', data?.id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully',
      emailId: data?.id 
    });

  } catch (error) {
    console.error('❌ Error in send-email API:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}