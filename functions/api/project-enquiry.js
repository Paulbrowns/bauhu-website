export async function onRequestPost(context) {
  try {
    const payload = await context.request.json();
    const apiKey = context.env.RESEND_API_KEY;
    const to = context.env.PROJECT_ENQUIRY_TO;
    const from = context.env.PROJECT_ENQUIRY_FROM || 'Bauhu Website <onboarding@resend.dev>';

    if (!apiKey || !to) {
      return Response.json({ error: 'Project enquiry email is not configured yet.' }, { status: 503 });
    }

    const customer = payload?.customer || {};
    const site = payload?.site || {};
    const body = [
      'NEW BAUHU WEBSITE PROJECT ENQUIRY',
      '',
      'CUSTOMER',
      `Name: ${customer.name || ''}`,
      `Email: ${customer.email || ''}`,
      `Phone: ${customer.phone || ''}`,
      `Country: ${customer.country || ''}`,
      '',
      'PROJECT',
      `Type: ${customer.projectType || ''}`,
      `Budget: ${customer.budget || ''}`,
      `Programme: ${customer.programme || ''}`,
      `Ownership: ${customer.ownership || ''}`,
      `Planning: ${customer.planning || ''}`,
      `Description: ${customer.description || ''}`,
      `Notes: ${customer.notes || ''}`,
      '',
      'SITE',
      `Location: ${site.place || ''}`,
      `Coordinates: ${site.lat ?? ''}, ${site.lng ?? ''}`,
      `Parcel: ${site.parcel || ''}`,
      `Area: ${site.area || ''}`,
      `Boundary source: ${site.boundarySource || ''}`,
      `Location source: ${site.source || ''}`,
    ].join('\n');

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: customer.email || undefined,
        subject: `New Bauhu project enquiry — ${customer.name || site.place || 'Website'}`,
        text: body,
      }),
    });

    if (!response.ok) {
      return Response.json({ error: 'The enquiry could not be delivered.' }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Invalid enquiry submission.' }, { status: 400 });
  }
}
