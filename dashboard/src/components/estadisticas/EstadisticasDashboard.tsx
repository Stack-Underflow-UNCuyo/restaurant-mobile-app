"use client";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { facturaService } from "@/services/facturaService";
import { reseniaService } from "@/services/reseniaService";
import type { Factura } from "@/types/factura";
import type { Resenia } from "@/types/resenia";
import {
  facturasPorTipoPago,
  ingresosPorMes,
  promediosResenia,
  resumen,
} from "@/lib/estadisticas";
import Spinner from "@/components/ui/Spinner";

import { ResumenCards } from "./ResumenCards";
import IngresosPorMesChart from "./IngresosPorMesChart";
import ReseniasWidget from "./ReseniasWidget";
import MediosDePagoChart from "./MediosDePagoChart";

const ANIO_ACTUAL = new Date().getFullYear();

export default function EstadisticasDashboard() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [resenias, setResenias] = useState<Resenia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([facturaService.getAll(), reseniaService.getAll()])
      .then(([fs, rs]) => {
        setFacturas(fs);
        setResenias(rs);
      })
      .catch(() => {
        setError(true);
        toast.error("Error al cargar las estadísticas");
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(
    () => ({
      resumen: resumen(facturas, resenias),
      ingresos: ingresosPorMes(facturas, ANIO_ACTUAL),
      promedios: promediosResenia(resenias),
      mediosPago: facturasPorTipoPago(facturas),
    }),
    [facturas, resenias],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-sm text-gray-500 dark:text-gray-400">
        No se pudieron cargar las estadísticas. Reintentá recargando la página.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <ResumenCards resumen={stats.resumen} />
        <IngresosPorMesChart data={stats.ingresos} anio={ANIO_ACTUAL} />
      </div>

      <div className="col-span-12 space-y-6 xl:col-span-5">
        <ReseniasWidget
          promedios={stats.promedios}
          cantResenias={stats.resumen.cantResenias}
        />
        <MediosDePagoChart conteo={stats.mediosPago} />
      </div>
    </div>
  );
}
