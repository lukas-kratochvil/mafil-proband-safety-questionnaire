import DOMPurify from "dompurify";

export const sanitizeHtml = (html: string) => {
  // Set target="_blank" in the <a> elements owning the 'target' attribute
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A" && "target" in node) {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener");
    }
  });

  return DOMPurify.sanitize(html);
};
