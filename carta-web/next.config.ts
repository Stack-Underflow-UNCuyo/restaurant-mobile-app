import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack(config) {
    // dashboard/mobile-app's package.json (sibling lockfiles) cause Next to infer
    // the workspace root as the parent directory, breaking CSS module resolution.
    // Pin both the modules search path and the tailwindcss alias so webpack always
    // finds it here.
    config.resolve.modules = [path.resolve(__dirname, "node_modules"), "node_modules"];
    config.resolve.alias = {
      ...(config.resolve.alias as Record<string, string>),
      tailwindcss: path.resolve(__dirname, "node_modules/tailwindcss"),
    };
    return config;
  },

  turbopack: {
    // Pin the root to this directory — otherwise, with sibling lockfiles in
    // dashboard/mobile-app, Next infers the workspace root as the parent folder
    // and fails to resolve this app's own node_modules.
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
