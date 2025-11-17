import sys
import colorcet as cc
import seaborn as sns
import logging

logger = logging.getLogger('DoodlColors')
logging.basicConfig(level=logging.INFO)

logger = logging.getLogger()

def resolve_color_palette(colors, n_colors, desat):
    cc_palette = ""

    if type(colors) is str and colors.startswith("cc."):
        try:
            cc_palette = colors.split(".")[1]
        except Exception as exc:
            logger.info(f'invalid colorcet palette "{colors}": {exc}')

        colors = getattr(cc, cc_palette)

    palette = sns.color_palette(palette=colors, desat=desat, n_colors=n_colors)

    if palette:
        palette = [
            "#%02X%02X%02X" % tuple(map(lambda x: int(255 * x), hue))
            for hue in [c for c in palette]
        ]

    return palette 


def safe_int(arg, default):
    try:
        return int(arg)
    except:
        return default

def safe_float(arg, default):
    try:
        return float(arg)
    except:
        return default
    
colors = sys.argv[1] if len(sys.argv) > 1 else 'pastel'
n_colors = safe_int(sys.argv[2] if len(sys.argv) > 2 else None, 10)
desat = safe_float(sys.argv[3] if len(sys.argv) > 3 else None, 1.0)

result = resolve_color_palette(colors, n_colors, desat)
# logger.info(f' colors={colors}, n_colors={n_colors}, desat={desat}')
print(result)   