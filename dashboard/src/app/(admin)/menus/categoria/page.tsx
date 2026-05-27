import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CategoriaTable from "@/components/menu/categoria";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categoría | Restaurant Dashboard",
};

export default function CategoriaPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Categoría" />
      <CategoriaTable />
    </div>
  );
}
