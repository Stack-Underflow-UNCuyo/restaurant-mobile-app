"use client";
import { use } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CartaTable from "@/components/menus/carta";

export default function CartaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div>
      <PageBreadcrumb pageTitle={`Carta #${id}`} />
      <CartaTable cartaId={id} />
    </div>
  );
}
