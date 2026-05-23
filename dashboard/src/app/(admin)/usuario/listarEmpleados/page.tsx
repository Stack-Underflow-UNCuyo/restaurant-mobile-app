import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import EmpleadoTable from "@/components/usuario/EmpleadoTable";

export const metadata: Metadata = {
    title: "Empleados | Restaurant Dashboard",
};

export default function EmpleadosPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Empleados" />
            <EmpleadoTable />
        </div>
    );
}
