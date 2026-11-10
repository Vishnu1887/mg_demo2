import { DivisionPortalContainer } from "@/components/DivisionPortalContainer";

export const metadata = {
  title: "BBS (Business Services) | Client Telephony & Brand Promotions Hub",
  description: "Executive advisory, operational transformation, telephony support, and enterprise consulting.",
};

export default function BbsRoute() {
  return <DivisionPortalContainer initialTab={2} />;
}
