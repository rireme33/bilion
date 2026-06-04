import { cookies } from "next/headers";
import BilionAppClient from "./BilionAppClient";

export default async function BilionAppPage() {
  const hasFounderAccess =
    (await cookies()).get("founder_access")?.value === "1";

  return <BilionAppClient hasFounderAccess={hasFounderAccess} />;
}
