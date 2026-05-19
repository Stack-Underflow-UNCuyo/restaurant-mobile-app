import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProvinciaTable from "@/components/direccion/ProvinciaTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Provincias | Restaurant Dashboard",
};

export default function ProvinciasPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Provincias" />
      <ProvinciaTable />
    </div>
  );
}
