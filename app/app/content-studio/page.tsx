import { getContentStudioRecords } from "@/lib/content-studio";
import ContentStudioClient from "./ContentStudioClient";

export default function ContentStudioPage() {
  const records = getContentStudioRecords();

  return <ContentStudioClient records={records} />;
}
