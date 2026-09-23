// طبقة موحّدة للتواصل مع الباك اند.
// عنوان الباك اند بيتحدد من متغير البيئة VITE_API_URL (ملف .env)،
// ولو مش موجود بيرجع لـ localhost:8000 كافتراضي وقت التطوير.

export const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:8000";

export type ReadImageResult = {
  text: string;
  [key: string]: unknown;
};

// إرسال صورة (كـ data URL من الكاميرا/الكانفاس) عشان الباك اند يقرا النص اللي فيها (OCR)
// مستخدمة في صفحة إمكانية الوصول. الصورة بتتبعت base64 + نوعها زي ما الباك اند متوقع بالظبط.
export async function readImageText(dataUrl: string, mimeType = "image/jpeg"): Promise<ReadImageResult> {
  const res = await fetch(`${API_URL}/api/read-image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_base64: dataUrl.split(",")[1], mime_type: mimeType }),
  });

  if (!res.ok) {
    throw new Error(`read-image failed: ${res.status}`);
  }

  return res.json();
}
