import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CartaTable from "@/components/menu/carta";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carta | Restaurant Dashboard",
};

export default function CartaPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Carta" />
      <CartaTable />
    </div>
  );
}
