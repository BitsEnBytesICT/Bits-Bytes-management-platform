import {defineConfig} from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    server: {watch: {usePolling: true, interval: 3000}},
    plugins: [react(), tailwindcss()],
    build: {
        rolldownOptions: {
            output: {
                codeSplitting: {
                    groups: [
                        {
                            name: "vendor",
                            test: /[\\/]node_modules[\\/]/,
                            // Keep dynamically imported dependencies separate from the initial bundle.
                            entriesAware: true,
                            minSize: 100_000,
                            maxSize: 500_000,
                        },
                    ],
                },
            },
        },
    },
});
