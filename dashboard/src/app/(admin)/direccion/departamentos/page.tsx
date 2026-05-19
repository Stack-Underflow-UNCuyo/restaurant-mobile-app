import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DepartamentoTable from "@/components/direccion/DepartamentoTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Departamentos | Restaurant Dashboard",
};

export default function DepartamentosPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Departamentos" />
      <DepartamentoTable />
    </div>
  );
}
