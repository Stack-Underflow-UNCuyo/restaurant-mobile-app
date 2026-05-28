import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PromocionTable from "@/components/factura/PromocionTable";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Promociones | Restaurant Dashboard",
};

export default function PromocionPage() {
    return (
    <div>
        <PageBreadcrumb pageTitle="Promociones" />
        <PromocionTable />
    </div>
    );
}
