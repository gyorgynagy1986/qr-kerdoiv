import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    console.log('📨 API route called');
    console.log('🔑 Resend API key exists:', !!process.env.RESEND_API_KEY);
    
    const { responses, timestamp } = await request.json();
    console.log('📝 Received responses:', responses);
    console.log('⏰ Timestamp:', timestamp);
    console.log('📊 Response count:', Object.keys(responses).length);

    // Format responses for email
    const formattedResponses = Object.entries(responses)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    console.log('📧 Formatted responses length:', formattedResponses.length);

    const emailPayload = {
      from: "hello@studiobromo.hu",
      to: ["gyurzi@gmail.com"],
      subject: "QR Készletgazdálkodási Rendszer - Kérdőív válaszok",
      text: `
Új kérdőív érkezett: ${timestamp}

Válaszok:
${formattedResponses}
      `,
    };

    console.log('📬 Email payload:', {
      from: emailPayload.from,
      to: emailPayload.to,
      subject: emailPayload.subject,
      textLength: emailPayload.text.length
    });

    console.log('🚀 Sending email via Resend...');
    const { data, error } = await resend.emails.send(emailPayload);

    if (error) {
      console.error('❌ Resend error:', error);
      return Response.json({ error }, { status: 400 });
    }

    console.log('✅ Email sent successfully:', data);
    return Response.json({ data, success: true });
  } catch (error) {
    console.error('💥 API route error:', error);
    console.error('🔍 Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return Response.json({ error: error.message }, { status: 500 });
  }
}