"""Alternative Ranklit symbols that say what we do: local shops, found on the map.
Same rules as gen.py: filled outlines only, 256 box, unit 8, angles 0/45/90 (plus the map fold)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gen import INK, PURPLE, LIME, WHITE, f, P, capsule, arcband, circle, rrect, svg

def tile(edge=INK, fill=LIME, b=12):
    return f'<path fill="{edge}" d="{rrect(8, 8, 240, 240, 64)}"/><path fill="{fill}" d="{rrect(8 + b, 8 + b, 240 - 2 * b, 240 - 2 * b, 64 - b)}"/>'

def scallops(x0, y, n, r):
    """Awning lower edge: n half-discs hanging from y."""
    return [f"M{f(x0 + 2 * r * i)} {f(y)} A{f(r)} {f(r)} 0 0 0 {f(x0 + 2 * r * (i + 1))} {f(y)} Z" for i in range(n)]

def ellipse_ring(cx, cy, rx, ry, w):
    o = f"M{f(cx - rx - w/2)} {f(cy)} A{f(rx + w/2)} {f(ry + w/2)} 0 1 0 {f(cx + rx + w/2)} {f(cy)} A{f(rx + w/2)} {f(ry + w/2)} 0 1 0 {f(cx - rx - w/2)} {f(cy)} Z"
    i = f"M{f(cx - rx + w/2)} {f(cy)} A{f(rx - w/2)} {f(ry - w/2)} 0 1 0 {f(cx + rx - w/2)} {f(cy)} A{f(rx - w/2)} {f(ry - w/2)} 0 1 0 {f(cx - rx + w/2)} {f(cy)} Z"
    return o + " " + i

def shop(fg=INK, acc=PURPLE, with_tile=True):
    """A · Shop on the map: a striped-awning storefront with a lit doorway, standing in a 'you are here' ring."""
    x0, x1, top, base, r = 48, 208, 56, 104, 20      # awning: 160 wide, 4 scallops of r20
    awning = rrect(x0, top, x1 - x0, base - top + 8, 16)   # +8 tucks under the scallops
    sc = scallops(x0, base, 4, r)
    stripes = [f"M{f(x0 + 40 * i + 40)} {f(top)} h{f(40)} V{f(base + 8)} h{f(-40)} Z" for i in (0, 2)]  # 2nd + 4th stripe
    stripes[1] = f"M{f(x0 + 120)} {f(top)} H{f(x1 - 16)} A16 16 0 0 1 {f(x1)} {f(top + 16)} V{f(base + 8)} H{f(x0 + 120)} Z"
    sc_acc = [sc[1], sc[3]]; sc_ink = [sc[0], sc[2]]
    body = rrect(68, 136, 120, 64, 10) + " " + rrect(108, 152, 40, 48, 12)   # door cut out
    door = rrect(108, 152, 40, 48, 12)
    ring = ellipse_ring(128, 200, 100, 22, 16)
    g = (f'<path fill="{fg}" fill-rule="evenodd" d="{ring}"/>'
         f'<path fill="{fg}" fill-rule="evenodd" d="{body}"/><path fill="{acc}" d="{door}"/>'
         f'<path fill="{fg}" d="{awning}"/><path fill="{fg}" d="{" ".join(sc_ink)}"/>'
         f'<path fill="{acc}" d="{" ".join(stripes + sc_acc)}"/>')
    if acc == fg:  # one-colour: stripes and door would vanish, so the door is cut out and stripes drop
        g = (f'<path fill="{fg}" fill-rule="evenodd" d="{ring}"/><path fill="{fg}" fill-rule="evenodd" d="{body}"/>'
             f'<path fill="{fg}" d="{awning} {" ".join(sc)}"/>')
    # scaled 86% about the centre, nudged up 6, so the ring clears the tile edge
    return (tile() if with_tile else "") + f'<g id="symbol" transform="translate(17.92 11.92) scale(0.86)">{g}</g>'

def folded_map(fg=INK, acc=PURPLE, with_tile=True, edge=INK, border=12):
    """B · Your spot on the map: a three-panel folded map; the middle panel is lit and holds your spot."""
    w, gap, h, z = 52, 6, 128, 16
    x = [44, 44 + w + gap, 44 + 2 * (w + gap)]
    tops = [(64, 64 + z), (64 + z, 64), (64, 64 + z)]
    panels = [f"M{P((x[i], tops[i][0]), (x[i] + w, tops[i][1]), (x[i] + w, tops[i][1] + h), (x[i], tops[i][0] + h))} Z" for i in range(3)]
    spot = circle(x[1] + w / 2, 128, 18)
    ring = circle(x[1] + w / 2, 128, 30) + " " + circle(x[1] + w / 2, 128, 22)
    mid_fill = acc
    g = (f'<path fill="{fg}" d="{panels[0]} {panels[2]}"/><path fill="{mid_fill}" d="{panels[1]}"/>')
    if acc != fg:
        g += f'<path fill="{LIME}" d="{circle(x[1] + w / 2, 128, 20)}"/><path fill="{fg}" d="{circle(x[1] + w / 2, 128, 11)}"/>'
    else:  # one-colour: punch the spot out of the middle panel
        g = (f'<path fill="{fg}" d="{panels[0]} {panels[2]}"/><path fill="{fg}" fill-rule="evenodd" d="{panels[1]} {circle(x[1] + w / 2, 128, 20)} {circle(x[1] + w / 2, 128, 11)}"/>')
    return (tile(edge=edge, b=border) if with_tile else "") + f'<g id="symbol">{g}</g>'

CONCEPTS = {"shop": shop, "folded-map": folded_map}

if __name__ == "__main__":
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "public", "brand", "concepts")
    os.makedirs(out, exist_ok=True)
    for k, fn in CONCEPTS.items():
        open(f"{out}/{k}.svg", "w").write(svg(256, 256, fn(), f"Ranklit {k}"))
        open(f"{out}/{k}-ink.svg", "w").write(svg(256, 256, fn(fg=INK, acc=INK, with_tile=False), f"Ranklit {k}"))
        open(f"{out}/{k}-white.svg", "w").write(svg(256, 256, fn(fg=WHITE, acc=WHITE, with_tile=False), f"Ranklit {k}"))
    print("ok")
