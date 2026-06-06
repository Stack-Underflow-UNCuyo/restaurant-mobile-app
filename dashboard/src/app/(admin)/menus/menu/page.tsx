import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MenuTable from "@/components/menus/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menú | Restaurant Dashboard",
};

export default function MenuPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Menú" />
      <MenuTable />
    </div>
  );
}
