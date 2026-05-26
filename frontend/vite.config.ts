import {defineConfig} from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    server: {
        watch: {
            usePolling: true,
            interval: 3000
        }
    },
    plugins: [react(), tailwindcss()]
});
