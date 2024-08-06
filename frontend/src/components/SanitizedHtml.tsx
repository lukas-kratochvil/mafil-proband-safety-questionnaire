import DOMPurify from "dompurify";

const sanitizeHtml = (html: string) => {
  // Set target="_blank" in the <a> elements owning the 'target' attribute
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A" && "target" in node) {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener");
    }
  });

  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
};

type SanitizedHtmlProps = {
  html: string;
};

export const SanitizedHtml = ({ html }: SanitizedHtmlProps) => (
  // eslint-disable-next-line react/no-danger
  <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />
);
