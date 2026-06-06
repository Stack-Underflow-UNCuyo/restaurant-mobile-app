import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import FacturaTable from "@/components/factura/FacturaTable";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Facturas | Restaurant Dashboard",
};

export default function FacturaPage() {
    return (
    <div>
        <PageBreadcrumb pageTitle="Facturas" />
        <FacturaTable />
    </div>
    );
}
