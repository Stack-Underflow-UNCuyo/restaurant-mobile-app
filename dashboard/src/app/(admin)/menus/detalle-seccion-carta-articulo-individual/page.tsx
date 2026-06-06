import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DetalleSeccionCartaArticuloIndividualTable from "@/components/menus/detalle-seccion-carta-articulo-individual";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalle Sección Carta Artículo Individual | Restaurant Dashboard",
};

export default function DetalleSeccionCartaArticuloIndividualPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Detalle Sección Carta Artículo Individual" />
      <DetalleSeccionCartaArticuloIndividualTable />
    </div>
  );
}
