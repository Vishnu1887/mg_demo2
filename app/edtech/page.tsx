import { DivisionPortalContainer } from "@/components/DivisionPortalContainer";

export const metadata = {
  title: "MGSolutions EdTech | Next-Gen Virtual STEM Academy",
  description: "Certified masterclasses, bootcamps, and student learning modules.",
};

export default function EdTechRoute() {
  return <DivisionPortalContainer initialTab={1} />;
}
