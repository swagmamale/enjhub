import { createServerFn } from "@tanstack/react-start";

/** Verify seller credentials server-side; password hashes never reach the browser. */
export const sellerLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { username: string; passwordHash: string }) => {
    const username = String(data?.username ?? "").trim().slice(0, 100);
    const passwordHash = String(data?.passwordHash ?? "").trim();
    if (!username || !/^[a-f0-9]{64}$/.test(passwordHash)) throw new Error("Invalid credentials");
    return { username, passwordHash };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("sellers")
      .select("id, username, password_hash, active")
      .eq("active", true);
    if (error) return { ok: false as const };
    const found = (rows ?? []).find(
      (s) => s.username.toLowerCase() === data.username.toLowerCase(),
    );
    if (!found || found.password_hash !== data.passwordHash) return { ok: false as const };
    return { ok: true as const, sellerId: found.id };
  });

/** Upload an image through the server so the storage bucket needs no public write access. */
export const uploadImage = createServerFn({ method: "POST" })
  .inputValidator((data: { folder: string; ext: string; contentType: string; base64: string }) => {
    const folder = String(data?.folder ?? "uploads").replace(/[^a-zA-Z0-9/_-]/g, "").slice(0, 60) || "uploads";
    const ext = String(data?.ext ?? "jpg").replace(/[^a-zA-Z0-9]/g, "").slice(0, 6) || "jpg";
    const contentType = String(data?.contentType ?? "application/octet-stream");
    if (!contentType.startsWith("image/")) throw new Error("Only image uploads are allowed");
    const base64 = String(data?.base64 ?? "");
    if (!base64 || base64.length > 14_000_000) throw new Error("Invalid file");
    return { folder, ext, contentType, base64 };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const bytes = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    const path = `${data.folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${data.ext}`;
    const { error } = await supabaseAdmin.storage.from("product-images").upload(path, bytes, {
      cacheControl: "31536000",
      contentType: data.contentType,
      upsert: false,
    });
    if (error) throw new Error("Upload failed");
    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from("product-images")
      .createSignedUrl(path, 60 * 60 * 24 * 3650);
    if (signErr || !signed?.signedUrl) throw new Error("Upload failed");
    return { url: signed.signedUrl };
  });
