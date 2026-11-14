"""Difference matte: the same render on black and on white -> one PNG with true transparency.

python3 matte.py ON_BLACK.png ON_WHITE.png OUT.png
alpha = 1 - (white - black); colour = black / alpha. Crops to the visible area plus a margin.
No dependencies (pure-Python PNG read/write).
"""
import struct, sys, zlib

def read_png(path):
    data = open(path, 'rb').read()
    assert data[:8] == b'\x89PNG\r\n\x1a\n'
    pos, idat, w = 8, b'', None
    while pos < len(data):
        n, typ = struct.unpack('>I4s', data[pos:pos + 8]); body = data[pos + 8:pos + 8 + n]; pos += 12 + n
        if typ == b'IHDR':
            w, h, depth, ctype = struct.unpack('>IIBB', body[:10])
            assert depth == 8 and ctype in (2, 6), (depth, ctype)
        elif typ == b'IDAT':
            idat += body
    bpp = 4 if ctype == 6 else 3
    raw, stride = zlib.decompress(idat), w * bpp
    out, prev, i = bytearray(), bytearray(stride), 0
    for _ in range(h):
        f = raw[i]; line = bytearray(raw[i + 1:i + 1 + stride]); i += 1 + stride
        for x in range(stride):
            a = line[x - bpp] if x >= bpp else 0; b = prev[x]; c = prev[x - bpp] if x >= bpp else 0
            if f == 1: line[x] = (line[x] + a) & 255
            elif f == 2: line[x] = (line[x] + b) & 255
            elif f == 3: line[x] = (line[x] + ((a + b) >> 1)) & 255
            elif f == 4:
                p = a + b - c; pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                line[x] = (line[x] + (a if pa <= pb and pa <= pc else b if pb <= pc else c)) & 255
        out += line; prev = line
    return w, h, bpp, out

def write_png(path, w, h, rgba):
    raw = b''.join(b'\x00' + bytes(rgba[y * w * 4:(y + 1) * w * 4]) for y in range(h))
    chunk = lambda t, b: struct.pack('>I', len(b)) + t + b + struct.pack('>I', zlib.crc32(t + b) & 0xffffffff)
    open(path, 'wb').write(b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b''))

wb, hb, pb, B = read_png(sys.argv[1]); ww, hw, pw, Wt = read_png(sys.argv[2])
assert (wb, hb) == (ww, hw)
w, h = wb, hb
out = bytearray(w * h * 4); minx, miny, maxx, maxy = w, h, 0, 0
for y in range(h):
    for x in range(w):
        ib, iw, o = (y * w + x) * pb, (y * w + x) * pw, (y * w + x) * 4
        d = sum(Wt[iw + k] - B[ib + k] for k in range(3)) / 3.0
        a = max(0.0, min(1.0, 1.0 - d / 255.0))
        if a < 0.02:
            continue
        for k in range(3):
            out[o + k] = max(0, min(255, round(B[ib + k] / a)))
        out[o + 3] = round(a * 255)
        if a > 0.06:
            minx, miny, maxx, maxy = min(minx, x), min(miny, y), max(maxx, x), max(maxy, y)
pad = 12
minx, miny, maxx, maxy = max(0, minx - pad), max(0, miny - pad), min(w - 1, maxx + pad), min(h - 1, maxy + pad)
cw, ch = maxx - minx + 1, maxy - miny + 1
crop = bytearray()
for y in range(miny, maxy + 1):
    crop += out[(y * w + minx) * 4:(y * w + maxx + 1) * 4]
write_png(sys.argv[3], cw, ch, crop)
print('wrote', sys.argv[3], cw, 'x', ch)
