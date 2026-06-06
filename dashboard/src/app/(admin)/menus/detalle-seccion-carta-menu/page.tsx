import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DetalleSeccionCartaMenuTable from "@/components/menus/detalle-seccion-carta-menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalle Sección Carta Menú | Restaurant Dashboard",
};

export default function DetalleSeccionCartaMenuPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Detalle Sección Carta Menú" />
      <DetalleSeccionCartaMenuTable />
    </div>
  );
}
