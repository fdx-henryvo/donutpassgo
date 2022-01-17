import dotenv from "dotenv";

dotenv.config();

export const config = {
  ACTIVE_DIRECTORY: {
    CLIENT_ID: process.env["ACTIVE_DIRECTORY_CLIENT_ID"] || "",
    TENANT_ID: process.env["ACTIVE_DIRECTORY_TENANT_ID"] || "",
    CLIENT_SECRET: process.env["ACTIVE_DIRECTORY_CLIENT_SECRET"] || "",
    TOKEN_ENDPOINT: `https://login.microsoftonline.com/${process.env["ACTIVE_DIRECTORY_TENANT_ID"]}/oauth2/v2.0/token`,
    TOKEN_SCOPE: "https://graph.microsoft.com/.default",
    GRAPH_ENDPOINT: "https://graph.microsoft.com/v1.0/",
    CLIENT_CREDENTIALS: "client_credentials",
  },
};
