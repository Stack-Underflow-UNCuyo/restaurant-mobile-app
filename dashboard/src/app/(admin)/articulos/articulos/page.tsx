import ArticuloTable from "@/components/articulos/ArticuloTable";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artículos | Restaurant Dashboard",
};

export default function ArticuloPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Artículos" />
      <ArticuloTable />
    </div>
  );
}
