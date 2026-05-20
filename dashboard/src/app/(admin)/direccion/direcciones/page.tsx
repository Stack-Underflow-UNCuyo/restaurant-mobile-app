import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DireccionTable from "@/components/direccion/DireccionTable";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Direcciones | Restaurant Dashboard",
};

export default function DireccionesPage() {
    return (
        <div>
        <PageBreadcrumb pageTitle="Direcciones" />
        <DireccionTable />
        </div>
    );
}
