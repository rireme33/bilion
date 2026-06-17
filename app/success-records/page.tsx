import { getSuccessRecords } from "@/lib/success-records";
import SuccessRecordsClient from "./SuccessRecordsClient";

export default function SuccessRecordsPage() {
  const records = getSuccessRecords();

  return <SuccessRecordsClient records={records} />;
}
