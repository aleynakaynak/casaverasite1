export const VILLA_COUNT = 30;

// Satışı kapalı villalar. Numarasız villa ayrıca hero üzerinde işaretlenir.
export const SOLD_VILLAS = new Set([10, 11, 25]);
export const UNNUMBERED_SOLD_POINT = [29.2, 41.9];

export const PLOT_AREAS = {
  1: 416, 2: 405, 3: 405, 4: 405, 5: 405, 6: 405, 7: 405, 8: 405, 9: 405, 10: 405,
  11: 409, 12: 409, 13: 409, 14: 409, 15: 409, 16: 409,
  17: 418, 18: 416,
  19: 409, 20: 409, 21: 409, 22: 409, 23: 409, 24: 409,
  25: 406, 26: 408, 27: 408, 28: 405, 29: 408, 30: 421
};

// Villa numaralarının anasayfa hero görseli üzerindeki yüzde konumu.
// Görsel oranı (1672/941) hero kutusuyla aynı olduğu için yüzdeler her ekranda hizalı kalır.
export const HERO_POINTS = {
  1:  [78.3, 24.7],  2:  [76.5, 27.2],  3:  [74.8, 29.8],  4:  [72.9, 33.0],
  5:  [71.1, 37.0],  6:  [68.5, 41.3],  7:  [65.6, 46.5],  8:  [62.2, 50.8],
  9:  [57.9, 59.5],  10: [52.5, 69.0],  11: [41.9, 61.4],  12: [48.5, 52.2],
  13: [54.2, 45.3],  14: [58.3, 40.2],  15: [61.9, 35.6],  16: [67.7, 28.2],
  17: [69.7, 25.3],  18: [59.4, 24.7],  19: [57.0, 26.9],  20: [54.4, 29.6],
  21: [51.4, 32.4],  22: [47.7, 35.9],  23: [43.1, 40.2],  24: [38.7, 44.3],
  25: [33.6, 49.4],  26: [36.4, 36.3],  27: [41.2, 32.4],  28: [45.2, 29.6],
  29: [48.2, 27.1],  30: [50.7, 23.3]
};

export const villaHref = no => `villa.html#v${String(no).padStart(2, '0')}`;
