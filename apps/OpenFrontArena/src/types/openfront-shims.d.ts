declare module "*.css?inline" {
  const content: string;
  export default content;
}

declare global {
  interface Window {
    showPage?: (pageId: string) => void;
  }
}

export {};
