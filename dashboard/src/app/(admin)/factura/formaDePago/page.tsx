import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import FormaDePagoTable from "@/components/factura/FormaDePagoTable";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Formas de pago | Restaurant Dashboard",
};

export default function FormaDePagoPage() {
    return (
    <div>
        <PageBreadcrumb pageTitle="Formas de pago" />
        <FormaDePagoTable />
    </div>
    );
}
