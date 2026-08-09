import { getContentStudioRecords } from "@/lib/content-studio";
import OfferFactoryClient from "../../app/offer-factory/OfferFactoryClient";

export default function OperatorOfferFactoryPage() {
  const records = getContentStudioRecords();

  return <OfferFactoryClient records={records} />;
}
