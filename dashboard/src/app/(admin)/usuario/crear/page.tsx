import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import CrearUsuario from "@/components/usuario/CrearUsuario";

export const metadata: Metadata = {
    title: "Crear Usuario | Restaurant Dashboard",
};

export default function CrearUsuarioPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Crear Usuario" />
            <CrearUsuario />
        </div>
    );
}

