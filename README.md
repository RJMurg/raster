![Raster](https://api.murga.cloud/raster/header?title=RASTER&subtitle=A%20README%20title%20image%20generator)

# Raster

Raster is a SvelteKit application which generates images to go at the top of READMEs, and for link previews.
Everything about an image is in its URL, so it can be pasted straight into Markdown:

```markdown
![My Project](https://example.com/raster/header?title=My%20Project&subtitle=What%20it%20does)
```

Visit `/raster` for a builder that previews images as you type and gives you the Markdown.

## Options

All of these go in the query string of `/raster/header`, and only `title` is needed.
Anything invalid falls back to its default, so a typo gives you a slightly different image rather than a broken one.

| Option      | Values                                                                                         | Default                               |
| ----------- | ---------------------------------------------------------------------------------------------- | ------------------------------------- |
| `title`     | Up to 120 characters. Newlines (`%0A`) force a line break when wrapping                        | `TITLE`                               |
| `subtitle`  | Up to 500 characters. Newlines (`%0A`) force a line break                                      | None                                  |
| `template`  | `rjm`, `black`, `white`, `aurora`, `terminal`, `editorial`, `blueprint`, `sunset`, `brutalist` | `rjm`                                 |
| `format`    | `banner` (2072×256), `og` (1200×630), `square` (1200×1200)                                     | `banner`                              |
| `align`     | `left`, `center`                                                                               | Set by the template                   |
| `titleSize` | `s`, `m`, `l`, `xl`, or a size in pixels from 16 to 300                                        | `l`                                   |
| `wrap`      | `true`, `false`: whether the title can take more than one line                                 | `false` for banners, `true` otherwise |
| `logo`      | `true`, `false`: whether to draw the RJM pattern                                               | `true`                                |
| `primary`   | A hex colour, with the `#` written as `%23` or left out                                        | Set by the template                   |
| `secondary` | A hex colour, with the `#` written as `%23` or left out                                        | Set by the template                   |
| `badge`     | The URL of a badge. Repeat it for up to 6 badges                                               | None                                  |

## Templates

**rjm: The RJM pattern on black. The default**

![rjm: The RJM pattern on black. The default](https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&template=rjm)

```
https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&template=rjm
```

**black: White text centred on black**

![black: White text centred on black](https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&template=black)

```
https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&template=black
```

**white: Black text centred on white**

![white: Black text centred on white](https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&template=white)

```
https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&template=white
```

**aurora: Cool light over a night sky, in Space Grotesk**

![aurora: Cool light over a night sky, in Space Grotesk](https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&template=aurora)

```
https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&template=aurora
```

**terminal: A green prompt in a dark window, in JetBrains Mono**

![terminal: A green prompt in a dark window, in JetBrains Mono](https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&template=terminal)

```
https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&template=terminal
```

**editorial: Serif type on warm paper, in Playfair Display**

![editorial: Serif type on warm paper, in Playfair Display](https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&template=editorial)

```
https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&template=editorial
```

**blueprint: A technical drawing on a blue grid**

![blueprint: A technical drawing on a blue grid](https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&template=blueprint)

```
https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&template=blueprint
```

**sunset: Heavy white type on a warm gradient, in Archivo Black**

![sunset: Heavy white type on a warm gradient, in Archivo Black](https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&template=sunset)

```
https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&template=sunset
```

**brutalist: Hard edges and a loud yellow**

![brutalist: Hard edges and a loud yellow](https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&template=brutalist)

```
https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&template=brutalist
```

## Formats

**banner: for the top of a README**

![banner: for the top of a README](https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&format=banner)

```
https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&format=banner
```

**og: for link previews**

<img src="https://api.murga.cloud/raster/header?title=Raster&amp;subtitle=A%20README%20title%20image%20generator&amp;format=og" width="600" alt="og: for link previews" />

```
https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&format=og
```

**square: for Twitter embeds and profile images**

<img src="https://api.murga.cloud/raster/header?title=Raster&amp;subtitle=A%20README%20title%20image%20generator&amp;format=square" width="400" alt="square: for Twitter embeds and profile images" />

```
https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&format=square
```

Every template works in every format:

**square, with the aurora template**

<img src="https://api.murga.cloud/raster/header?title=Raster%20Header&amp;subtitle=A%20README%20title%20image%20generator&amp;format=square&amp;template=aurora" width="400" alt="square, with the aurora template" />

```
https://api.murga.cloud/raster/header?title=Raster%20Header&subtitle=A%20README%20title%20image%20generator&format=square&template=aurora
```

**og, with the brutalist template**

<img src="https://api.murga.cloud/raster/header?title=Raster%20Header&amp;subtitle=A%20README%20title%20image%20generator&amp;format=og&amp;template=brutalist" width="600" alt="og, with the brutalist template" />

```
https://api.murga.cloud/raster/header?title=Raster%20Header&subtitle=A%20README%20title%20image%20generator&format=og&template=brutalist
```

## Alignment

**Centred on the RJM template, which stays clear of the pattern**

![Centred on the RJM template, which stays clear of the pattern](https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&align=center)

```
https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&align=center
```

**Left-aligned on a template that centres by default**

![Left-aligned on a template that centres by default](https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&template=black&align=left)

```
https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&template=black&align=left
```

## No logo

The RJM pattern can be turned off, which also frees up the full width of the image for text.

**The RJM template without its pattern**

![The RJM template without its pattern](https://api.murga.cloud/raster/header?title=Raster&subtitle=All%20of%20the%20style%2C%20with%20none%20of%20the%20initials&logo=false)

```
https://api.murga.cloud/raster/header?title=Raster&subtitle=All%20of%20the%20style%2C%20with%20none%20of%20the%20initials&logo=false
```

**Centred, without the pattern**

![Centred, without the pattern](https://api.murga.cloud/raster/header?title=Raster&subtitle=All%20of%20the%20style%2C%20with%20none%20of%20the%20initials&logo=false&align=center)

```
https://api.murga.cloud/raster/header?title=Raster&subtitle=All%20of%20the%20style%2C%20with%20none%20of%20the%20initials&logo=false&align=center
```

## Title sizes

Sizes are a target: titles shrink when they have to, and never overflow.

**titleSize=s: Small**

![titleSize=s: Small](https://api.murga.cloud/raster/header?title=Raster&titleSize=s)

```
https://api.murga.cloud/raster/header?title=Raster&titleSize=s
```

**titleSize=m: Medium**

![titleSize=m: Medium](https://api.murga.cloud/raster/header?title=Raster&titleSize=m)

```
https://api.murga.cloud/raster/header?title=Raster&titleSize=m
```

**titleSize=l: Large, the default**

![titleSize=l: Large, the default](https://api.murga.cloud/raster/header?title=Raster&titleSize=l)

```
https://api.murga.cloud/raster/header?title=Raster&titleSize=l
```

**titleSize=xl: Extra large**

![titleSize=xl: Extra large](https://api.murga.cloud/raster/header?title=Raster&titleSize=xl)

```
https://api.murga.cloud/raster/header?title=Raster&titleSize=xl
```

**titleSize=64: an exact size in pixels**

![titleSize=64: an exact size in pixels](https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&titleSize=64)

```
https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&titleSize=64
```

## Long text

Text is measured before it's drawn. Subtitles wrap and shrink, and only once they can't get any smaller do they end in an ellipsis. Long subtitles stay centred on the bar beside them.

**A long subtitle**

![A long subtitle](https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20longer%20description%20wraps%20onto%20as%20many%20lines%20as%20it%20needs%2C%20and%20shrinks%20to%20stay%20inside%20the%20image%20and%20clear%20of%20the%20RJM%20pattern%2C%20however%20much%20there%20is%20to%20say%20about%20the%20project)

```
https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20longer%20description%20wraps%20onto%20as%20many%20lines%20as%20it%20needs%2C%20and%20shrinks%20to%20stay%20inside%20the%20image%20and%20clear%20of%20the%20RJM%20pattern%2C%20however%20much%20there%20is%20to%20say%20about%20the%20project
```

**A long title on one line, which shrinks to fit**

![A long title on one line, which shrinks to fit](https://api.murga.cloud/raster/header?title=A%20Considerably%20Longer%20Title%20Than%20Usual&subtitle=A%20README%20title%20image%20generator)

```
https://api.murga.cloud/raster/header?title=A%20Considerably%20Longer%20Title%20Than%20Usual&subtitle=A%20README%20title%20image%20generator
```

**A long title with wrap=true**

![A long title with wrap=true](https://api.murga.cloud/raster/header?title=A%20Considerably%20Longer%20Title%20That%20Wraps%20Over%20Two%20Lines&subtitle=A%20README%20title%20image%20generator&wrap=true)

```
https://api.murga.cloud/raster/header?title=A%20Considerably%20Longer%20Title%20That%20Wraps%20Over%20Two%20Lines&subtitle=A%20README%20title%20image%20generator&wrap=true
```

**Wrapping a long title in a square**

<img src="https://api.murga.cloud/raster/header?title=A%20Considerably%20Longer%20Title%20That%20Wraps&amp;subtitle=A%20longer%20description%20wraps%20onto%20as%20many%20lines%20as%20it%20needs%2C%20and%20shrinks%20to%20stay%20inside%20the%20image%20and%20clear%20of%20the%20RJM%20pattern%2C%20however%20much%20there%20is%20to%20say%20about%20the%20project&amp;format=square" width="400" alt="Wrapping a long title in a square" />

```
https://api.murga.cloud/raster/header?title=A%20Considerably%20Longer%20Title%20That%20Wraps&subtitle=A%20longer%20description%20wraps%20onto%20as%20many%20lines%20as%20it%20needs%2C%20and%20shrinks%20to%20stay%20inside%20the%20image%20and%20clear%20of%20the%20RJM%20pattern%2C%20however%20much%20there%20is%20to%20say%20about%20the%20project&format=square
```

**A forced line break**

![A forced line break](https://api.murga.cloud/raster/header?title=First%20line%0ASecond%20line&wrap=true&template=editorial)

```
https://api.murga.cloud/raster/header?title=First%20line%0ASecond%20line&wrap=true&template=editorial
```

## Colours

`primary` and `secondary` set the title's gradient and the accent beside the subtitle.

**A green gradient**

![A green gradient](https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&primary=14532d&secondary=4ade80)

```
https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&primary=14532d&secondary=4ade80
```

**An orange gradient**

![An orange gradient](https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&primary=9a3412&secondary=fb923c)

```
https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&primary=9a3412&secondary=fb923c
```

**A gradient on the black template**

![A gradient on the black template](https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&template=black&primary=22d3ee&secondary=e879f9)

```
https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&template=black&primary=22d3ee&secondary=e879f9
```

## Badges

Badges from elsewhere are fetched and drawn into the image. Images with badges are cached for 5 minutes rather than an hour, so build statuses stay fresh, and a badge that can't be loaded is left out rather than breaking the image.

**One badge**

![One badge](https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&badge=https%3A%2F%2Fimg.shields.io%2Fbadge%2Fbuild-passing-brightgreen)

```
https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&badge=https%3A%2F%2Fimg.shields.io%2Fbadge%2Fbuild-passing-brightgreen
```

**Several badges**

![Several badges](https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&badge=https%3A%2F%2Fimg.shields.io%2Fbadge%2Fbuild-passing-brightgreen&badge=https%3A%2F%2Fimg.shields.io%2Fbadge%2Flicense-GPL--3.0-blue&badge=https%3A%2F%2Fimg.shields.io%2Fbadge%2Fversion-2.0.0-orange)

```
https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&badge=https%3A%2F%2Fimg.shields.io%2Fbadge%2Fbuild-passing-brightgreen&badge=https%3A%2F%2Fimg.shields.io%2Fbadge%2Flicense-GPL--3.0-blue&badge=https%3A%2F%2Fimg.shields.io%2Fbadge%2Fversion-2.0.0-orange
```

**Badges on a centred template**

![Badges on a centred template](https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&template=white&badge=https%3A%2F%2Fimg.shields.io%2Fbadge%2Fbuild-passing-brightgreen&badge=https%3A%2F%2Fimg.shields.io%2Fbadge%2Flicense-GPL--3.0-blue)

```
https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&template=white&badge=https%3A%2F%2Fimg.shields.io%2Fbadge%2Fbuild-passing-brightgreen&badge=https%3A%2F%2Fimg.shields.io%2Fbadge%2Flicense-GPL--3.0-blue
```

**Badges in a square**

<img src="https://api.murga.cloud/raster/header?title=Raster&amp;subtitle=A%20README%20title%20image%20generator&amp;template=aurora&amp;format=square&amp;badge=https%3A%2F%2Fimg.shields.io%2Fbadge%2Fbuild-passing-brightgreen&amp;badge=https%3A%2F%2Fimg.shields.io%2Fbadge%2Flicense-GPL--3.0-blue" width="400" alt="Badges in a square" />

```
https://api.murga.cloud/raster/header?title=Raster&subtitle=A%20README%20title%20image%20generator&template=aurora&format=square&badge=https%3A%2F%2Fimg.shields.io%2Fbadge%2Fbuild-passing-brightgreen&badge=https%3A%2F%2Fimg.shields.io%2Fbadge%2Flicense-GPL--3.0-blue
```

As this makes the server fetch URLs, only these hosts are allowed:

- `img.shields.io`
- `badgen.net`
- `badge.fury.io`
- `github.com`
- `gitlab.com`
- `codecov.io`
- `coveralls.io`
- `api.netlify.com`
- `over.rjm.ie`
- `git.rjm.ie`

Add others with the `BADGE_HOSTS` environment variable, as a comma-separated list of hostnames. Badges have to be HTTPS, and SVG or PNG.
