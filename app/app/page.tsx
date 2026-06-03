import { cookies } from "next/headers";
import BilionAppClient from "./BilionAppClient";

export default async function BilionAppPage() {
  const hasPaidAccess = (await cookies()).get("paid_access")?.value === "1";

  return <BilionAppClient hasPaidAccess={hasPaidAccess} />;
}
