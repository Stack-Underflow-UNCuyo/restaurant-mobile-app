import { BoxIconLine, DollarLineIcon } from "@/icons";
import type { ResumenEstadisticas } from "@/lib/estadisticas";

function formatMonto(monto: number): string {
  return `$${Math.round(monto).toLocaleString("es-AR")}`;
}

interface CardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function MetricCard({ icon, label, value }: CardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        {icon}
      </div>
      <div className="mt-5">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
          {value}
        </h4>
      </div>
    </div>
  );
}

export function ResumenCards({ resumen }: { resumen: ResumenEstadisticas }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      <MetricCard
        icon={<DollarLineIcon className="text-gray-800 size-6 dark:text-white/90" />}
        label="Total facturado"
        value={formatMonto(resumen.totalFacturado)}
      />
      <MetricCard
        icon={<BoxIconLine className="text-gray-800 dark:text-white/90" />}
        label="Facturas cobradas"
        value={resumen.cantFacturas.toLocaleString("es-AR")}
      />
    </div>
  );
}
