import { cookies } from "next/headers";

import JapaneseBilionAppClient from "./JapaneseBilionAppClient";

export default async function JapaneseSignalPreviewPage() {
  const cookieStore = await cookies();
  const hasFounderAccess =
    cookieStore.get("founder_access")?.value === "1" ||
    cookieStore.get("paid_access")?.value === "1";

  return <JapaneseBilionAppClient hasFounderAccess={hasFounderAccess} />;
}
