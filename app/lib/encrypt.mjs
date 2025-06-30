export const encrypt = async (rawMessage, messageId) => {
  try {
    const encoder = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    //Derive key using PBKDF2

    const baseKey = await crypto.subtle.importKey(
      "raw",
      encoder.encode(messageId),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    const cryptoKey = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"]
    );

    //Encryption
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      cryptoKey,
      encoder.encode(rawMessage)
    );

    //Combine salt(16) + (12) + ciphertext

    const combined = new Uint8Array(
      salt.length + iv.length + encrypted.byteLength
    );
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encrypted), salt.length + iv.length);

    //Binary-safe Base64 encoding

    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    throw new Error(
      `Encryption failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const decrypt = async (ciphertext, messageId) => {
  try {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    //Decode Base64
    const binaryString = atob(ciphertext);
    const combined = new Uint8Array(binaryString.length);
    let i = 0;
    for (i; i < binaryString.length; i++) {
      combined[i] = binaryString.charCodeAt(i);
    }
    //Extract components (salt:12, iv:12, encrypted: rest
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const data = combined.slice(28);
    //Derive key using PBKDF2
    const baseKey = await crypto.subtle.importKey(
      "raw",
      encoder.encode(messageId),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );
    const cryptoKey = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
    //Perform secryption
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      cryptoKey,
      data
    );
    return decoder.decode(decrypted);
  } catch (error) {
    throw new Error(
      `Decryption failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

(async () => {
  try {
    const message = { text: "Sensitive data", timeStamp: Date.now() };
    const messageId = "creese12";
    console.log("original message", message);
    const encrypted = await encrypt(message, messageId);
    console.log("Encrypted", encrypted);
    const decrypted = await decrypt(encrypted, messageId);
    console.log("Decrypted", decrypted);
  } catch (error) {
    console.error(
      "Operation failed",
      error instanceof Error ? error.message : String(error)
    );
  }
})();
