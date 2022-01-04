# Genuary 004




-----

Reminder:

```zsh
ffmpeg -r 12 -f image2 -s 1080x1080 -pattern_type glob -i '*.jpg' -vcodec libx264 -crf 25  -pix_fmt yuv420p test.mp4
```