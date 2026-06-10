"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import type { ConteoPorTipoPago } from "@/lib/estadisticas";
import { TipoPago } from "@/types/formaDePago";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ETIQUETAS: Record<TipoPago, string> = {
  [TipoPago.EFECTIVO]: "Efectivo",
  [TipoPago.TRANSFERENCIA]: "Transferencia",
  [TipoPago.BILLETERA_VIRTUAL]: "Billetera virtual",
};

export default function MediosDePagoChart({ conteo }: { conteo: ConteoPorTipoPago }) {
  const labels = Object.values(ETIQUETAS);
  const series = [
    conteo[TipoPago.EFECTIVO],
    conteo[TipoPago.TRANSFERENCIA],
    conteo[TipoPago.BILLETERA_VIRTUAL],
  ];
  const total = series.reduce((a, b) => a + b, 0);

  const options: ApexOptions = {
    colors: ["#465fff", "#9CB9FF", "#12b76a"],
    labels,
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "donut",
    },
    stroke: { show: false },
    dataLabels: { enabled: false },
    legend: {
      show: true,
      position: "bottom",
      fontFamily: "Outfit",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Facturas",
              formatter: () => `${total}`,
            },
          },
        },
      },
    },
    tooltip: {
      y: { formatter: (val: number) => `${val} factura${val === 1 ? "" : "s"}` },
    },
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
        Medios de pago
      </h3>

      {total === 0 ? (
        <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
          Sin facturas cobradas todavía.
        </p>
      ) : (
        <ReactApexChart options={options} series={series} type="donut" height={280} />
      )}
    </div>
  );
}
