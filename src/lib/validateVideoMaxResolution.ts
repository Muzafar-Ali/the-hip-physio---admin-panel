function validateVideoMaxResolution(file: File, maxW: number, maxH: number) {
  return new Promise<{ ok: boolean; width: number; height: number }>((resolve) => {
    const el = document.createElement('video');
    el.preload = 'metadata';
    el.muted = true;

    const url = URL.createObjectURL(file);

    const done = (ok: boolean, w = 0, h = 0) => {
      URL.revokeObjectURL(url);
      resolve({ ok, width: w, height: h });
    };

    el.addEventListener('loadedmetadata', () => {
      const w = el.videoWidth || 0;
      const h = el.videoHeight || 0;
      done(w <= maxW && h <= maxH, w, h);
    }, { once: true });

    el.addEventListener('error', () => done(false, 0, 0), { once: true });

    el.src = url;
    el.load(); // ensure metadata load kicks in across browsers
  });
}
