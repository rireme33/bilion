import { getContentStudioRecords } from "@/lib/content-studio";
import OfferLadderClient from "./OfferLadderClient";

export default function OperatorOfferLadderPage() {
  const records = getContentStudioRecords();

  return <OfferLadderClient records={records} />;
}
