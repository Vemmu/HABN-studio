type SendWhatsAppMessageArgs = {
  to: string;
  body: string;
};

type ReplyButton = {
  id: string;
  title: string;
};

type ListRow = {
  id: string;
  title: string;
  description?: string;
};

const WHATSAPP_API_VERSION = "v22.0";

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export async function sendWhatsAppMessage({
  to,
  body,
}: SendWhatsAppMessageArgs) {
  const accessToken = getRequiredEnv("WHATSAPP_ACCESS_TOKEN");
  const phoneNumberId = getRequiredEnv("WHATSAPP_PHONE_NUMBER_ID");

  const response = await fetch(
    `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        text: { body },
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`WhatsApp send failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

async function sendWhatsAppPayload(to: string, payload: Record<string, unknown>) {
  const accessToken = getRequiredEnv("WHATSAPP_ACCESS_TOKEN");
  const phoneNumberId = getRequiredEnv("WHATSAPP_PHONE_NUMBER_ID");

  const response = await fetch(
    `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        ...payload,
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`WhatsApp send failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

export async function sendWhatsAppButtons(
  to: string,
  body: string,
  buttons: ReplyButton[]
) {
  return sendWhatsAppPayload(to, {
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: body },
      action: {
        buttons: buttons.slice(0, 3).map((button) => ({
          type: "reply",
          reply: button,
        })),
      },
    },
  });
}

export async function sendWhatsAppList(
  to: string,
  body: string,
  buttonText: string,
  rows: ListRow[],
  header?: string,
  footer?: string
) {
  return sendWhatsAppPayload(to, {
    type: "interactive",
    interactive: {
      type: "list",
      header: header ? { type: "text", text: header } : undefined,
      body: { text: body },
      footer: footer ? { text: footer } : undefined,
      action: {
        button: buttonText,
        sections: [
          {
            title: "Options",
            rows: rows.slice(0, 10),
          },
        ],
      },
    },
  });
}

export function normalizeWhatsAppPhone(phone: string) {
  return phone.trim().replace(/[^\d+]/g, "");
}

export type IncomingWhatsAppMessage = {
  from: string;
  id?: string;
  text?: {
    body?: string;
  };
  interactive?: {
    type?: "button_reply" | "list_reply";
    button_reply?: {
      id?: string;
      title?: string;
    };
    list_reply?: {
      id?: string;
      title?: string;
      description?: string;
    };
  };
  type?: string;
};

export function extractIncomingMessage(payload: unknown): IncomingWhatsAppMessage | null {
  const body = payload as {
    entry?: Array<{
      changes?: Array<{
        value?: {
          messages?: IncomingWhatsAppMessage[];
        };
      }>;
    }>;
  };

  return body.entry?.[0]?.changes?.[0]?.value?.messages?.[0] ?? null;
}

export function parseNumericSelection(input: string, max: number) {
  const selection = Number(input.trim());

  if (!Number.isInteger(selection) || selection < 1 || selection > max) {
    return null;
  }

  return selection - 1;
}

export function formatNumberedList(
  title: string,
  items: Array<{ name: string; description?: string | null }>
) {
  const lines = items.map((item, index) => {
    const suffix = item.description ? ` - ${item.description}` : "";
    return `${index + 1}. ${item.name}${suffix}`;
  });

  return [title, ...lines].join("\n");
}

export function parseAppointmentDate(input: string) {
  const trimmed = input.trim();
  const match = trimmed.match(
    /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})$/
  );

  if (!match) {
    return null;
  }

  const [, year, month, day, hour, minute] = match;
  const appointmentDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute)
  );

  if (Number.isNaN(appointmentDate.getTime())) {
    return null;
  }

  const isSameDate =
    appointmentDate.getFullYear() === Number(year) &&
    appointmentDate.getMonth() === Number(month) - 1 &&
    appointmentDate.getDate() === Number(day) &&
    appointmentDate.getHours() === Number(hour) &&
    appointmentDate.getMinutes() === Number(minute);

  if (!isSameDate || appointmentDate.getTime() < Date.now()) {
    return null;
  }

  return appointmentDate;
}

export function formatAppointmentDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function getIncomingSelectionValue(message: IncomingWhatsAppMessage) {
  if (message.interactive?.type === "button_reply") {
    return message.interactive.button_reply?.id?.trim() ?? null;
  }

  if (message.interactive?.type === "list_reply") {
    return message.interactive.list_reply?.id?.trim() ?? null;
  }

  return message.text?.body?.trim() ?? null;
}
