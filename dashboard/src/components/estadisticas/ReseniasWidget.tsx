"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import type { PromediosResenia } from "@/lib/estadisticas";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface Props {
  promedios: PromediosResenia;
  cantResenias: number;
}

export default function ReseniasWidget({ promedios, cantResenias }: Props) {
  const round1 = (n: number) => Math.round(n * 10) / 10;

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "55%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => round1(val).toFixed(1),
      style: { colors: ["#fff"] },
    },
    xaxis: {
      categories: ["Ambiente", "Servicio", "Comida"],
      max: 5,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: { show: false },
    grid: { xaxis: { lines: { show: true } } },
    tooltip: {
      y: { formatter: (val: number) => `${round1(val).toFixed(1)} / 5` },
    },
  };

  const series = [
    {
      name: "Promedio",
      data: [round1(promedios.ambiente), round1(promedios.servicio), round1(promedios.comida)],
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Reseñas</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {cantResenias} {cantResenias === 1 ? "reseña" : "reseñas"}
        </span>
      </div>

      <div className="mt-4 flex items-end gap-2">
        <span className="text-4xl font-bold text-gray-800 dark:text-white/90">
          {round1(promedios.general).toFixed(1)}
        </span>
        <span className="mb-1 text-sm text-gray-500 dark:text-gray-400">/ 5 satisfacción general</span>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <ReactApexChart options={options} series={series} type="bar" height={180} />
      </div>
    </div>
  );
}
