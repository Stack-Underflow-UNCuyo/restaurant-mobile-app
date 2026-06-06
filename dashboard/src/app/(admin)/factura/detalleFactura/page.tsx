import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DetalleFacturaTable from "@/components/factura/DetalleFacturaTable";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Detalles de factura | Restaurant Dashboard",
};

export default function DetalleFacturaPage() {
    return (
    <div>
        <PageBreadcrumb pageTitle="Detalles de factura" />
        <DetalleFacturaTable />
    </div>
    );
}
