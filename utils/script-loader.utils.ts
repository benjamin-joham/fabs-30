/**
 * Generic script loader util which checks if script is already loaded and resolves a Promise.
 */
export function loadScript(src?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${src}"]`);

    if (!src) {
      return reject('no script "src" defined');
    }

    if (existingScript) {
      return resolve();
    }

    const tag = document.createElement('script');

    tag.src = src;
    tag.addEventListener('load', () => {
      resolve();
    });
    const firstScriptTag = document?.getElementsByTagName('script')[0];

    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  });
}
