import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // as timelines do GSAP e o canvas global não suportam montagem dupla no desenvolvimento
  transpilePackages: ['three'],
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)), // há outro package-lock.json acima desta pasta
};

export default nextConfig;
