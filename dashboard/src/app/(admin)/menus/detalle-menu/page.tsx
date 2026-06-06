import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DetalleMenuTable from "@/components/menu/detalle-menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalle Menu | Restaurant Dashboard",
};

export default function MovimientosStockPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Detalle Menu" />
      <DetalleMenuTable />
    </div>
  );
}
