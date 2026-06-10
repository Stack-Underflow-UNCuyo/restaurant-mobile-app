import type { Metadata } from "next";
import EstadisticasDashboard from "@/components/estadisticas/EstadisticasDashboard";

export const metadata: Metadata = {
  title: "Aromas de viña",
  description: "Panel de estadísticas — Aromas de viña",
};

export default function Home() {
  return <EstadisticasDashboard />;
}
