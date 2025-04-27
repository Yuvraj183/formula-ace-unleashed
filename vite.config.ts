import { defineConfig } from 'vite';

export default defineConfig({
  // ... your configuration settings
});
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    export default {
  server: {
    host: 'localhost',
    port: 3000, // or any other port
  },
};
  },
}));
