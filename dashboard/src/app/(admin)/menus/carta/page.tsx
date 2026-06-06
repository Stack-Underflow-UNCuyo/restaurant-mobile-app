import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CartasListTable from "@/components/menu/cartas-list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cartas | Restaurant Dashboard",
};

export default function CartaPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Cartas" />
      <CartasListTable />
    </div>
  );
}
