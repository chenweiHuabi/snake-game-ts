import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/game.ts'],
  format: ['iife'],
  globalName: 'Game',
  outDir: 'dist',
  publicDir: 'public',
  clean: true,
  minify: true,
  sourcemap: true,
  dts: false
});