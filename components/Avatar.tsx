"use client";

// עיגול תמונת פרופיל — מציג תמונה (נתיב או base64) או אמוג'י
export default function Avatar({
  src,
  size = 56,
  ring = false,
}: {
  src: string;
  size?: number;
  ring?: boolean;
}) {
  const isImg = src.startsWith("/") || src.startsWith("data:") || src.startsWith("http");
  return (
    <div
      className={`avatar ${ring ? "ring" : ""}`}
      style={{ width: size, height: size, fontSize: size }}
    >
      {isImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="profile" />
      ) : (
        <span className="emoji">{src || "🙂"}</span>
      )}
    </div>
  );
}
