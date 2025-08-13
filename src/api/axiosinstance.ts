// src/api/axiosClient.ts
import axios from "axios";
import { createDPoPProof, loadKeys } from "../utils/dpop";

export const axiosClient = (
  token?: string | null,
  correlationId = `${Date.now()}`
) => {
  const instance = axios.create({
    // baseURL: "http://localhost:10008",
    baseURL: "https://2681e74dabf6.ngrok-free.app",
    headers: {
      "Content-Type": "application/json",
      "X-Correlation-Id": correlationId,
    },
  });

  // Only attach DPoP if token & keys exist
  if (token) {
    instance.interceptors.request.use(async (config) => {
      const keys = await loadKeys();
      if (!keys) return config; // no keys = skip DPoP

      const url = new URL(config.url || "", config.baseURL).toString();

      const proof = await createDPoPProof({
        privateKey: keys.privateKey,
        publicJwk: keys.publicJwk,
        htm: (config.method || "GET").toUpperCase(),
        htu: url,
        ath: token ? await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token)).then(buf =>
          btoa(String.fromCharCode(...new Uint8Array(buf)))
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "")
        ) : undefined,
      });

      if (config.headers) {
        config.headers["Authorization"] = `DPoP ${token}`;
        config.headers["DPoP"] = proof;
      }

      return config;
    });
  }

  return instance;
};
