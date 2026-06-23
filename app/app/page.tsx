import { cookies } from "next/headers";
import { getGmailMarketSignals } from "@/lib/gmail-signals";
import BilionAppClient from "./BilionAppClient";

export default async function BilionAppPage() {
  const cookieStore = await cookies();
  const hasFounderAccess =
    cookieStore.get("founder_access")?.value === "1" ||
    cookieStore.get("paid_access")?.value === "1";
  const gmailMarketSignals = getGmailMarketSignals();

  return (
    <BilionAppClient
      gmailMarketSignals={gmailMarketSignals}
      hasFounderAccess={hasFounderAccess}
    />
  );
}
