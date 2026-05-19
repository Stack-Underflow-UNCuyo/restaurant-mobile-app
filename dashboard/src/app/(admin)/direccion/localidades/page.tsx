import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import LocalidadTable from "@/components/direccion/LocalidadTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Localidades | Restaurant Dashboard",
};

export default function LocalidadesPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Localidades" />
      <LocalidadTable />
    </div>
  );
}
