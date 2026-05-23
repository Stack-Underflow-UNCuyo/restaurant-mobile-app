import UnidadDeMedidaTable from "@/components/articulos/UnidadDeMedidaTable";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Unidad de Medida | Restaurant Dashboard",
};

export default function UnidadDeMedidaPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Unidad de Medida" />
      <UnidadDeMedidaTable />
    </div>
  );
}
