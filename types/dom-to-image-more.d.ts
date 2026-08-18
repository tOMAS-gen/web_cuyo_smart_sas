declare module 'dom-to-image-more' {
  interface Options {
    /** @deprecated — no usar: reintroduce el borde de FR-001/FR-003 (research.md § 1) */
    scale?: number;
    bgcolor?: string;
    width?: number;
    height?: number;
    style?: Partial<CSSStyleDeclaration> | Record<string, string>;
    quality?: number;
    filter?: (node: Node) => boolean;
    /** Controla qué propiedades computadas se copian al clon por nodo (research.md § 1, bug del "recuadro" fantasma). */
    filterStyles?: (sourceElement: Element, propertyName: string) => boolean;
    cacheBust?: boolean;
  }
  function toBlob(node: HTMLElement, options?: Options): Promise<Blob>;
  function toPng(node: HTMLElement, options?: Options): Promise<string>;
  function toJpeg(node: HTMLElement, options?: Options): Promise<string>;
  export default { toBlob, toPng, toJpeg };
}
