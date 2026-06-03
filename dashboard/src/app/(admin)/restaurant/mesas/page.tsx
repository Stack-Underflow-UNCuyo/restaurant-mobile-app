import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MesaRestauranteTable from "@/components/mesaRestaurante/MesaRestauranteTable";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Mesas | Restaurant Dashboard" };

export default function MesasPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Mesas" />
      <MesaRestauranteTable />
    </div>
  );
}
