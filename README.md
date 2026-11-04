![Raster](https://api.murga.cloud/raster/header?title=RASTER&subtitle=A%20README%20title%20image%20generator)

# Raster

Raster is a SvelteKit application which generates images to go at the top of READMEs, for link previews, and [notices](#notices) for the things readers shouldn't miss.
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

## Notices

`/raster/notice` makes banners for the things readers shouldn't miss, with the same five types as [GitHub's alerts](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts). They're for anywhere those don't work, like a project page, a package registry or a chat message. They're 1600 pixels wide and as tall as their message needs, so it's never cut off.

| Option    | Values                                                    | Default                |
| --------- | --------------------------------------------------------- | ---------------------- |
| `type`    | `note`, `tip`, `important`, `warning`, `caution`          | `note`                 |
| `message` | Up to 500 characters. Newlines (`%0A`) force a line break | None                   |
| `title`   | Up to 120 characters                                      | The name of the `type` |
| `theme`   | `dark`, `light`                                           | `dark`                 |

Text in an image can't be read by screen readers or found by searching, so repeat it in the alt text.

### Dark

**Note**

![Note: Useful information that users should know, even when skimming content.](https://api.murga.cloud/raster/notice?type=note&message=Useful%20information%20that%20users%20should%20know%2C%20even%20when%20skimming%20content.)

```
https://api.murga.cloud/raster/notice?type=note&message=Useful%20information%20that%20users%20should%20know%2C%20even%20when%20skimming%20content.
```

**Tip**

![Tip: Helpful advice for doing things better or more easily.](https://api.murga.cloud/raster/notice?type=tip&message=Helpful%20advice%20for%20doing%20things%20better%20or%20more%20easily.)

```
https://api.murga.cloud/raster/notice?type=tip&message=Helpful%20advice%20for%20doing%20things%20better%20or%20more%20easily.
```

**Important**

![Important: Key information users need to know to achieve their goal.](https://api.murga.cloud/raster/notice?type=important&message=Key%20information%20users%20need%20to%20know%20to%20achieve%20their%20goal.)

```
https://api.murga.cloud/raster/notice?type=important&message=Key%20information%20users%20need%20to%20know%20to%20achieve%20their%20goal.
```

**Warning**

![Warning: Urgent info that needs immediate user attention to avoid problems.](https://api.murga.cloud/raster/notice?type=warning&message=Urgent%20info%20that%20needs%20immediate%20user%20attention%20to%20avoid%20problems.)

```
https://api.murga.cloud/raster/notice?type=warning&message=Urgent%20info%20that%20needs%20immediate%20user%20attention%20to%20avoid%20problems.
```

**Caution**

![Caution: Advises about risks or negative outcomes of certain actions.](https://api.murga.cloud/raster/notice?type=caution&message=Advises%20about%20risks%20or%20negative%20outcomes%20of%20certain%20actions.)

```
https://api.murga.cloud/raster/notice?type=caution&message=Advises%20about%20risks%20or%20negative%20outcomes%20of%20certain%20actions.
```

### Light

**Note**

![Note: Useful information that users should know, even when skimming content.](https://api.murga.cloud/raster/notice?type=note&message=Useful%20information%20that%20users%20should%20know%2C%20even%20when%20skimming%20content.&theme=light)

```
https://api.murga.cloud/raster/notice?type=note&message=Useful%20information%20that%20users%20should%20know%2C%20even%20when%20skimming%20content.&theme=light
```

**Tip**

![Tip: Helpful advice for doing things better or more easily.](https://api.murga.cloud/raster/notice?type=tip&message=Helpful%20advice%20for%20doing%20things%20better%20or%20more%20easily.&theme=light)

```
https://api.murga.cloud/raster/notice?type=tip&message=Helpful%20advice%20for%20doing%20things%20better%20or%20more%20easily.&theme=light
```

**Important**

![Important: Key information users need to know to achieve their goal.](https://api.murga.cloud/raster/notice?type=important&message=Key%20information%20users%20need%20to%20know%20to%20achieve%20their%20goal.&theme=light)

```
https://api.murga.cloud/raster/notice?type=important&message=Key%20information%20users%20need%20to%20know%20to%20achieve%20their%20goal.&theme=light
```

**Warning**

![Warning: Urgent info that needs immediate user attention to avoid problems.](https://api.murga.cloud/raster/notice?type=warning&message=Urgent%20info%20that%20needs%20immediate%20user%20attention%20to%20avoid%20problems.&theme=light)

```
https://api.murga.cloud/raster/notice?type=warning&message=Urgent%20info%20that%20needs%20immediate%20user%20attention%20to%20avoid%20problems.&theme=light
```

**Caution**

![Caution: Advises about risks or negative outcomes of certain actions.](https://api.murga.cloud/raster/notice?type=caution&message=Advises%20about%20risks%20or%20negative%20outcomes%20of%20certain%20actions.&theme=light)

```
https://api.murga.cloud/raster/notice?type=caution&message=Advises%20about%20risks%20or%20negative%20outcomes%20of%20certain%20actions.&theme=light
```

### More

**A custom title**

![Deprecated: This API will be removed in the next major version.](https://api.murga.cloud/raster/notice?type=warning&title=Deprecated&message=This%20API%20will%20be%20removed%20in%20the%20next%20major%20version.)

```
https://api.murga.cloud/raster/notice?type=warning&title=Deprecated&message=This%20API%20will%20be%20removed%20in%20the%20next%20major%20version.
```

**A long message**

![Important: Notices grow to fit what they have to say, so a longer message simply wraps onto more lines and makes the image taller. Nothing gets shrunk or cut off with an ellipsis, up to the limit of 500 characters.](https://api.murga.cloud/raster/notice?type=important&message=Notices%20grow%20to%20fit%20what%20they%20have%20to%20say%2C%20so%20a%20longer%20message%20simply%20wraps%20onto%20more%20lines%20and%20makes%20the%20image%20taller.%20Nothing%20gets%20shrunk%20or%20cut%20off%20with%20an%20ellipsis%2C%20up%20to%20the%20limit%20of%20500%20characters.)

```
https://api.murga.cloud/raster/notice?type=important&message=Notices%20grow%20to%20fit%20what%20they%20have%20to%20say%2C%20so%20a%20longer%20message%20simply%20wraps%20onto%20more%20lines%20and%20makes%20the%20image%20taller.%20Nothing%20gets%20shrunk%20or%20cut%20off%20with%20an%20ellipsis%2C%20up%20to%20the%20limit%20of%20500%20characters.
```

**Forced line breaks**

![Tip: Run the migrations, then restart the server.](https://api.murga.cloud/raster/notice?type=tip&message=1.%20Run%20the%20migrations%0A2.%20Restart%20the%20server)

```
https://api.murga.cloud/raster/notice?type=tip&message=1.%20Run%20the%20migrations%0A2.%20Restart%20the%20server
```

**A title on its own**

![Caution: Experimental](https://api.murga.cloud/raster/notice?type=caution&title=Experimental)

```
https://api.murga.cloud/raster/notice?type=caution&title=Experimental
```

### Matching the reader's theme

GitHub tells images which theme is in use through `<picture>`:

```html
<picture>
	<source
		media="(prefers-color-scheme: dark)"
		srcset="
			https://api.murga.cloud/raster/notice?type=warning&message=Back%20up%20your%20data%20first.
		"
	/>
	<img
		src="https://api.murga.cloud/raster/notice?type=warning&message=Back%20up%20your%20data%20first.&theme=light"
		alt="Warning: Back up your data first."
	/>
</picture>
```
