import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SeccionCartaTable from "@/components/menus/seccion-carta";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sección Carta | Restaurant Dashboard",
};

export default function SeccionCartaPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Sección Carta" />
      <SeccionCartaTable />
    </div>
  );
}
