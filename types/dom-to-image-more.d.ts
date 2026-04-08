declare module 'dom-to-image-more' {
  interface Options {
    scale?: number;
    bgcolor?: string;
    width?: number;
    height?: number;
    style?: Record<string, string>;
    quality?: number;
  }
  function toBlob(node: HTMLElement, options?: Options): Promise<Blob>;
  function toPng(node: HTMLElement, options?: Options): Promise<string>;
  function toJpeg(node: HTMLElement, options?: Options): Promise<string>;
  export default { toBlob, toPng, toJpeg };
}
