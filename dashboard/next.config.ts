import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    // mobile-app/package.json causes Next to infer the workspace root as the
    // parent directory, breaking CSS module resolution. Pin both the modules
    // search path and the tailwindcss alias so webpack always finds it here.
    config.resolve.modules = [path.resolve(__dirname, "node_modules"), "node_modules"];
    config.resolve.alias = {
      ...(config.resolve.alias as Record<string, string>),
      tailwindcss: path.resolve(__dirname, "node_modules/tailwindcss"),
    };
    return config;
  },

    turbopack: {
      // Fijamos la raíz a este directorio. Sin esto, al existir otro lockfile
      // en un proyecto hermano (mobile-app), Next infiere la raíz del workspace
      // en la carpeta padre y no resuelve los módulos de node_modules del dashboard.
      root: path.resolve(__dirname),
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  
};

export default nextConfig;
