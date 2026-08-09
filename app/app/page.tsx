import { cookies } from "next/headers";
import BilionCoreClient from "./BilionCoreClient";

export default async function BilionAppPage() {
  const cookieStore = await cookies();
  const hasFounderAccess =
    cookieStore.get("founder_access")?.value === "1" ||
    cookieStore.get("paid_access")?.value === "1";
  return <BilionCoreClient hasFounderAccess={hasFounderAccess} />;
}
