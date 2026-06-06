import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EmpresaForm from "@/components/empresa/EmpresaForm";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Empresa | Restaurant Dashboard",
};

export default function EmpresaPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Empresa" />
      <EmpresaForm />
    </div>
  );
}
