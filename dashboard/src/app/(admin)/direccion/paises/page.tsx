import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PaisTable from "@/components/direccion/PaisTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Países | Restaurant Dashboard",
};

export default function PaisesPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Países" />
      <PaisTable />
    </div>
  );
}
