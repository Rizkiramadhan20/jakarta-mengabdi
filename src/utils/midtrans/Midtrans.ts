import midtransClient from "midtrans-client";

const serverKey = process.env.MIDTRANS_SERVER_KEY;
const clientKey = process.env.MIDTRANS_CLIENT_KEY;

if (!serverKey) {
  throw new Error("MIDTRANS_SERVER_KEY is not defined");
}

export const snap = new midtransClient.Snap({
  isProduction: process.env.NODE_ENV === "production",
  serverKey,
  clientKey,
});
