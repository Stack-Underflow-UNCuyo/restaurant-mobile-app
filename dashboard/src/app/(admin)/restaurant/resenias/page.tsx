import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ReseniaTable from "@/components/resenia/ReseniaTable";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Reseñas | Restaurant Dashboard" };

export default function ReseniasPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Reseñas" />
      <ReseniaTable />
    </div>
  );
}
