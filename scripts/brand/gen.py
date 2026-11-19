"""Ranklit logo generator. Every shape is a filled outline (no strokes, no text, no masks).
Grid unit 8 on a 256 viewBox; stroke weight W; exact 0/45/90 deg geometry."""
import math, sys, os
OUT = sys.argv[1] if len(sys.argv) > 1 else "/tmp/logo/out"
os.makedirs(OUT, exist_ok=True)
INK, PURPLE, LIME, WHITE, PAPER = "#1a1523", "#9b47cc", "#c6f432", "#ffffff", "#fff8ec"

f = lambda v: f"{v:.2f}".rstrip("0").rstrip(".")
def P(*pts): return " ".join(f(v) for p in pts for v in p)

def capsule(x1, y1, x2, y2, w):
    """Segment with round caps, as one closed path."""
    h = w / 2; dx, dy = x2 - x1, y2 - y1; L = math.hypot(dx, dy)
    nx, ny = -dy / L * h, dx / L * h
    a, b = (x1 + nx, y1 + ny), (x2 + nx, y2 + ny)
    c, d = (x2 - nx, y2 - ny), (x1 - nx, y1 - ny)
    return f"M{P(a)} L{P(b)} A{f(h)} {f(h)} 0 0 0 {P(c)} L{P(d)} A{f(h)} {f(h)} 0 0 0 {P(a)} Z"

def arcband(cx, cy, r, a0, a1, w, cap0=True, cap1=True):
    """Annulus sector from angle a0 to a1 (deg, screen coords, clockwise), optional round caps."""
    h = w / 2; ro, ri = r + h, r - h
    pt = lambda rr, a: (cx + rr * math.cos(math.radians(a)), cy + rr * math.sin(math.radians(a)))
    large = 1 if (a1 - a0) % 360 > 180 else 0
    s = f"M{P(pt(ro, a0))} A{f(ro)} {f(ro)} 0 {large} 1 {P(pt(ro, a1))} "
    s += f"A{f(h)} {f(h)} 0 0 1 {P(pt(ri, a1))} " if cap1 else f"L{P(pt(ri, a1))} "
    s += f"A{f(ri)} {f(ri)} 0 {large} 0 {P(pt(ri, a0))} "
    s += f"A{f(h)} {f(h)} 0 0 1 {P(pt(ro, a0))} Z" if cap0 else "Z"
    return s

def circle(cx, cy, r):
    return f"M{f(cx - r)} {f(cy)} A{f(r)} {f(r)} 0 1 0 {f(cx + r)} {f(cy)} A{f(r)} {f(r)} 0 1 0 {f(cx - r)} {f(cy)} Z"

def ring(cx, cy, r, w):  # evenodd hole
    return circle(cx, cy, r + w / 2) + " " + circle(cx, cy, r - w / 2)

def rrect(x, y, w, h, r):
    return (f"M{f(x + r)} {f(y)} H{f(x + w - r)} A{f(r)} {f(r)} 0 0 1 {f(x + w)} {f(y + r)} V{f(y + h - r)} "
            f"A{f(r)} {f(r)} 0 0 1 {f(x + w - r)} {f(y + h)} H{f(x + r)} A{f(r)} {f(r)} 0 0 1 {f(x)} {f(y + h - r)} "
            f"V{f(y + r)} A{f(r)} {f(r)} 0 0 1 {f(x + r)} {f(y)} Z")

def svg(w, h, body, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {f(w)} {f(h)}" role="img" aria-labelledby="t">'
            f'<title id="t">{title}</title>{body}</svg>\n')

# ---------- Wordmark "ranklit": custom geometric letters ----------
W = 40          # stroke weight
BASE, XH, ASC = 180, 100, 40   # centerlines: baseline, x-height, ascender
R = 40          # bowl / shoulder radius (centerline)
GAP = 18        # space between letter extents

def letter(ch, s):
    """Return (ink_paths, accent_paths, right_extent) for letter whose first stem centre is s."""
    ink, acc = [], []
    if ch == "r":
        ink += [capsule(s, BASE, s, XH + R, W), arcband(s + R, XH + R, R, 180, 270, W, cap0=False)]
        right = s + R + W / 2
    elif ch == "a":
        ink += [ring(s + R, XH + R, R, W), capsule(s + 2 * R, XH, s + 2 * R, BASE, W)]
        right = s + 2 * R + W / 2
    elif ch == "n":
        ink += [capsule(s, BASE, s, XH + R, W), arcband(s + R, XH + R, R, 180, 360, W, cap0=False, cap1=False),
                capsule(s + 2 * R, XH + R, s + 2 * R, BASE, W)]
        right = s + 2 * R + W / 2
    elif ch == "k":
        ink += [capsule(s, ASC, s, BASE, W), capsule(s, XH + 60, s + 60, XH, W), capsule(s + 24, XH + 36, s + 68, BASE, W)]
        right = s + 68 + 16
    elif ch == "l":
        ink += [capsule(s, ASC, s, BASE, W)]
        right = s + W / 2
    elif ch == "i":
        ink += [capsule(s, XH, s, BASE, W)]
        acc += [circle(s, ASC, W / 2 + 4)]  # the lit dot
        right = s + W / 2 + 4
    elif ch == "t":
        ink += [capsule(s, ASC + 20, s, BASE, W), capsule(s - 24, XH, s + 40, XH, W)]
        right = s + 40 + W / 2
    return ink, acc, right

LEFT_OVERHANG = {"r": W / 2, "a": W / 2, "n": W / 2, "k": W / 2, "l": W / 2, "i": W / 2 + 4, "t": 24 + W / 2}

def wordmark(ink_c=INK, acc_c=PURPLE, x0=0):
    x, inks, accs = x0, [], []
    for ch in "ranklit":
        s = x + LEFT_OVERHANG[ch]
        a, b, right = letter(ch, s)
        inks += a; accs += b; x = right + GAP
    width = x - GAP - x0
    body = f'<g id="wordmark" fill="{ink_c}" fill-rule="evenodd">' + "".join(f'<path d="{d}"/>' for d in inks) + f'<path fill="{acc_c}" d="{" ".join(accs)}"/></g>'
    return body, width

# ---------- Symbol concepts (256 box) ----------
def sym_B(fg=INK, dot=PURPLE, tile=LIME, edge=INK, border=12):
    """'Lit r': the r of the wordmark plus its lit spot, on a sticker tile."""
    w, r = 48, 48
    s, cy = 66, 118             # stem centre x, shoulder centre y (optically centred in the tile)
    parts = [capsule(s, 192, s, cy, w), arcband(s + r, cy, r, 180, 270, w, cap0=False)]
    lit = circle(s + r + 68, cy - r, 28)  # 16u gap after the arm cap so it never merges at 16px
    t = ""
    if tile:
        b = border
        t = f'<path fill="{edge}" d="{rrect(8, 8, 240, 240, 64)}"/><path fill="{tile}" d="{rrect(8 + b, 8 + b, 240 - 2 * b, 240 - 2 * b, 64 - b)}"/>'
    return t + f'<g id="symbol" fill="{fg}">' + "".join(f'<path d="{d}"/>' for d in parts) + f'<path fill="{dot}" d="{lit}"/></g>'

def sym_A(fg=INK, dot=PURPLE, dim="#1a152333", tile=LIME, edge=INK):
    """'Grid R': the 49-point scan, simplified to 5x5, lit dots spell R; top-right is you."""
    R_ = ["XXXX.", "X...X", "XXXX.", "X..X.", "X...X"]
    on, off = [], []
    for r_, row in enumerate(R_):
        for c, v in enumerate(row):
            (on if v == "X" else off).append(circle(48 + c * 40, 48 + r_ * 40, 15))
    you = off.pop(4)  # row 0 col 4
    t = f'<path fill="{edge}" d="{rrect(8, 8, 240, 240, 64)}"/><path fill="{tile}" d="{rrect(20, 20, 216, 216, 52)}"/>' if tile else ""
    return t + f'<g id="symbol"><path fill="{dim}" d="{" ".join(off)}"/><path fill="{fg}" d="{" ".join(on)}"/><path fill="{dot}" d="{you}"/></g>'

def sym_C(fg=INK, dot=PURPLE, tile=LIME, edge=INK):
    """'Ripple spot': you (a dot) with the scan ripple spreading from you, open toward the map."""
    parts = [arcband(112, 144, 64, 210, 330, 32), arcband(112, 144, 112, 225, 315, 32)]
    t = f'<path fill="{edge}" d="{rrect(8, 8, 240, 240, 64)}"/><path fill="{tile}" d="{rrect(20, 20, 216, 216, 52)}"/>' if tile else ""
    return t + f'<g id="symbol" transform="translate(16 32)"><path fill="{fg}" d="{" ".join(parts)}"/><path fill="{dot}" d="{circle(112, 144, 30)}"/></g>'

if __name__ == "__main__":
    wm, ww = wordmark()
    open(f"{OUT}/wordmark.svg", "w").write(svg(ww + 16, 224, f'<g transform="translate(8 0)">{wm}</g>', "Ranklit"))
    for k, fn in {"A": sym_A, "B": sym_B, "C": sym_C}.items():
        open(f"{OUT}/concept-{k}.svg", "w").write(svg(256, 256, fn(), f"Ranklit concept {k}"))
        open(f"{OUT}/concept-{k}-mono.svg", "w").write(svg(256, 256, fn(fg=INK, dot=INK, tile=None) if k != "A" else fn(fg=INK, dot=INK, dim="none", tile=None), f"Ranklit concept {k} mono"))
    print("wordmark width", ww)
