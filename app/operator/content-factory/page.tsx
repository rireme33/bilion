import { getContentStudioRecords } from "@/lib/content-studio";
import ContentFactoryClient from "./ContentFactoryClient";

export default function OperatorContentFactoryPage() {
  const records = getContentStudioRecords();

  return <ContentFactoryClient records={records} />;
}
