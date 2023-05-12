declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number;

            NODE_ENV: "test" | "development" | "production";

            // DATADOG
            DATADOG_API_KEY: string = "";
        }
    }
}
export { }
