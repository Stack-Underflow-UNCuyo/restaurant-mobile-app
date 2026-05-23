import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import UsuarioTable from "@/components/usuario/UsuarioTable";

export const metadata: Metadata = {
    title: "Usuarios | Restaurant Dashboard",
};

export default function UsuariosPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Usuarios" />
            <UsuarioTable />
        </div>
    );
}
