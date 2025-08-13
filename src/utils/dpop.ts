// src/utils/dpop.ts
import { generateKeyPair, exportJWK, importJWK, SignJWT } from "jose";

export type DPoPKeys = {
  publicJwk: JsonWebKey;
  privateKey: CryptoKey; // Browser crypto key
};

const B64URL = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

// Save to localStorage
export async function saveKeys(publicJwk: JsonWebKey, privateKey: CryptoKey) {
  const exportedPrivate = await crypto.subtle.exportKey("jwk", privateKey);
  localStorage.setItem("dpop_public_jwk", JSON.stringify(publicJwk));
  localStorage.setItem("dpop_private_jwk", JSON.stringify(exportedPrivate));
}

// Load from localStorage
export async function loadKeys(): Promise<DPoPKeys | null> {
  const pub = localStorage.getItem("dpop_public_jwk");
  const priv = localStorage.getItem("dpop_private_jwk");
  if (!pub || !priv) return null;

  const publicJwk = JSON.parse(pub);
  const privateJwk = JSON.parse(priv);

  // importJWK returns CryptoKey in browsers
  const privateKey = (await importJWK(privateJwk, "ES256")) as CryptoKey;

  return { publicJwk, privateKey };
}

// Generate new key pair
export async function createKeys(): Promise<DPoPKeys> {
  const { publicKey, privateKey } = await generateKeyPair("ES256", {
    extractable: true,
  });

  const publicJwk = await exportJWK(publicKey);
  await saveKeys(publicJwk, privateKey);
  return { publicJwk, privateKey };
}

// SHA-256 + Base64URL
export async function sha256B64Url(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return B64URL(new Uint8Array(hash));
}

// Create DPoP Proof
export async function createDPoPProof(opts: {
  privateKey: CryptoKey;
  publicJwk: JsonWebKey;
  htm: string;
  htu: string;
  ath?: string;
}) {
  const { privateKey, publicJwk, htm, htu, ath } = opts;
  const now = Math.floor(Date.now() / 1000);

  const payload: Record<string, any> = {
    htm,
    htu,
    iat: now,
    jti: crypto.randomUUID(),
  };

  if (ath) payload.ath = ath;

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "ES256", typ: "dpop+jwt", jwk: publicJwk })
    .sign(privateKey as CryptoKey); // ensure type
}
