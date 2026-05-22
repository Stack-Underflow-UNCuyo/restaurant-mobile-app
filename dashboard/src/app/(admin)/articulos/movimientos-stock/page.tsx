import MovimientoStockTable from "@/components/articulos/MovimientoStockTable";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Movimientos de Stock | Restaurant Dashboard",
};

export default function MovimientosStockPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Movimientos de Stock" />
      <MovimientoStockTable />
    </div>
  );
}
