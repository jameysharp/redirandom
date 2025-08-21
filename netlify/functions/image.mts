import { fetchWithCache } from "@netlify/cache";
import type { Context } from "@netlify/functions";

export const config: Config = {
  path: "/image/:width(\\d+)/:height(\\d+)/:url_part(.*)"
};

export default async (req: Request, context: Context) => {
  const { width, height, url_part } = context.params;
  let url = new URL(url_part).toString();
  let seen = [];
  while (seen.length < 10) {
    seen.push(url);
    const request = new Request(url);
    const cached = await fetchWithCache(request);
    const body = await cached.text();
    const lines = body.split(/\r?\n/);
    const choices = Array.from(
      Iterator.from(lines).map((line) => parseLine(line, url)).filter((choice) => accept(choice, width, height, seen))
    );
    // console.log(choices);
    if (choices.length == 0) {
      break;
    }

    const chosen = choices[Math.floor(Math.random() * choices.length)];
    url = chosen.url;
    if (chosen.img) {
      const response = '<!DOCTYPE html><style>body{margin:0}a,img{display:block}img{width:100%;height:auto;border:0}</style>'
        + '<a target="_blank" rel="nofollow" href="'
        + escapeAttribute(chosen.url)
        + '"><img src="'
        + escapeAttribute(chosen.img)
        + '" title="'
        + escapeAttribute(chosen.alt)
        + '" alt="'
        + escapeAttribute(chosen.alt)
        + '" width='
        + (chosen.width || width)
        + ' height='
        + (chosen.height || height)
        + '></a>';
      return new Response(response, {
        headers: {
          "content-type": "text/html",
        },
      });
    }
  }

  // couldn't find any satisfying images, either because we hit the recursion
  // limit or because all the choices in the last list we looked at got filtered
  // out.
  return new Response("");
};

function parseLine(line, base) {
  line = line.trim();
  if (line.startsWith("#")) {
    return null;
  }

  const parts = /^(?:(\d+)x(\d+)\s+)?(\S+)(?:\s+(\S+)\s*(.*))?$/.exec(line);
  if (!parts) {
    return null;
  }

  const [, width, height, url_part, img_part, alt_part] = parts;
  const url = new URL(url_part, base).toString();
  const img = img_part ? new URL(img_part, base).toString() : "";
  const alt = alt_part || "";

  return { width, height, url, img, alt };
}

function accept(choice, width, height, seen) {
  if (!choice) {
    return false;
  }

  if (!choice.img && seen.includes(choice.url)) {
    return false;
  }

  if (choice.width) {
    // only pick images we wouldn't have to scale up
    if (choice.width < width || choice.height < height) {
      return false;
    }

    // if we scale width to match the container, ensure that height falls within
    // a couple of pixels of the container's height too. two pixels is enough to
    // allow both 468x60 and 728x90 images in an 8:1 aspect ratio box
    const scale = width / choice.width;
    if (Math.abs(scale * choice.height - height) > 2) {
      return false;
    }
  }

  return true;
}

function escapeAttribute(s) {
  return s.replace(/["&]/g, match => ({ '"': "&quot;", "&": "&amp;" }[match]));
}
