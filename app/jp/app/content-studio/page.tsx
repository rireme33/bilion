import { getContentStudioRecords } from "@/lib/content-studio";
import ContentStudioClient from "../../../app/content-studio/ContentStudioClient";

export default function JapaneseContentStudioPage() {
  const records = getContentStudioRecords();

  return <ContentStudioClient locale="ja" records={records} />;
}
