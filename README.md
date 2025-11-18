The web service for doodl.ai conversion functions


Web Service url: https://svgtopng.doodl.ai


Example of Curl command to convert svg to png :

```bash
curl --data-urlencode name@/path/to/svg-file/filename.svg --data-urlencode width=100 --data-urlencode height=100 -o image.png https://svgtopng.doodl.ai/convert
```

Example of Curl command to get list of colors from seaborn names :

```bash
curl -X POST https://svgtopng.doodl.ai/colors \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "colors=cc.glasbey" \
     -d "n_colors=4" \
     -d "desat=1.0"
```
