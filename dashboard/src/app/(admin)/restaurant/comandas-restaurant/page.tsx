import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComandaRestaurantTable from "@/components/comanda/ComandaRestaurantTable";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Comandas de restaurante | Restaurant Dashboard" };

export default function ComandasRestaurantPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Comandas de restaurante" />
      <ComandaRestaurantTable />
    </div>
  );
}
