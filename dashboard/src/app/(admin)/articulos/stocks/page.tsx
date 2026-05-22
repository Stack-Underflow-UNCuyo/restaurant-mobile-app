import StockTable from "@/components/articulos/StockTable";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stock | Restaurant Dashboard",
};

export default function StockPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Stock" />
      <StockTable />
    </div>
  );
}
