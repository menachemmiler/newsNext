import { SITE_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>{SITE_NAME}</strong>
        <p>אתר חדשות אישי — כותרות, שיתוף, שמירה וחיפוש.</p>
      </div>
      <p>© {new Date().getFullYear()} כל הזכויות שמורות למקורות הכתבות.</p>
    </footer>
  );
}
