"use client";

import { useT } from "@/lib/i18n";

export default function Footer() {
  const { t } = useT();

  return (
    <footer className="site-footer">
      <div>
        <strong>{t("siteName")}</strong>
        <p>{t("footerBlurb")}</p>
      </div>
      <p>{t("copyright", { year: new Date().getFullYear() })}</p>
    </footer>
  );
}
