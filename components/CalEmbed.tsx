"use client";

import Script from "next/script";

export default function CalEmbed() {
  return (
    <>
      <div
        id="cal-inline"
        style={{ width: "100%", minHeight: "700px", overflow: "scroll", borderRadius: "1.5rem" }}
      />
      <Script
        id="cal-embed-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function (C, A, L) {
              let p = function (a, ar) { a.q.push(ar); };
              let d = C.document;
              C.Cal = C.Cal || function () {
                let cal = C.Cal; let ar = arguments;
                if (!cal.loaded) {
                  cal.ns = {}; cal.q = cal.q || [];
                  d.head.appendChild(d.createElement("script")).src = A;
                  cal.loaded = true;
                }
                if (ar[0] === L) {
                  const api = function () { p(api, arguments); };
                  const namespace = ar[1];
                  api.q = api.q || [];
                  typeof namespace === "string"
                    ? (cal.ns[namespace] = api) && p(api, ar)
                    : p(cal, ar);
                  return;
                }
                p(cal, ar);
              };
            })(window, "https://app.cal.com/embed/embed.js", "init");

            Cal("init", { origin: "https://cal.com" });
            Cal("inline", {
              elementOrSelector: "#cal-inline",
              config: { layout: "month_view" },
              calLink: "growvera",
            });
            Cal("ui", {
              hideEventTypeDetails: false,
              layout: "month_view",
            });
          `,
        }}
      />
    </>
  );
}
