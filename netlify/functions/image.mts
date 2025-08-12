import { fetchWithCache } from "@netlify/cache";
import type { Context } from "@netlify/functions";

export const config: Config = {
  path: "/image/(\\d+)/(\\d+)/*"
};

export default async (req: Request, context: Context) => {
  let url = new URL(context.params[2]).toString();
  let seen = [];
  while (seen.length < 10) {
    seen.push(url);
    const request = new Request(url);
    const cached = await fetchWithCache(request);
    const body = await cached.text();
    const lines = body.split(/\r?\n/);
    const choices = Array.from(
      Iterator.from(lines).map((line) => parseLine(line, url)).filter((choice) => accept(choice, seen))
    );
    // console.log(choices);
    const chosen = choices[Math.floor(Math.random() * choices.length)];
    url = chosen.url;
    if (!chosen.nested) {
      const response = '<!DOCTYPE html><style>a,img{display:block}body{margin:0}</style><a href="'
        + escapeAttribute(chosen.url)
        + '" target="_blank" rel="nofollow"><img src="'
        + escapeAttribute(chosen.img)
        + '" alt="'
        + escapeAttribute(chosen.alt)
        + '" border=0 width='
        + context.params[0]
        + ' height='
        + context.params[1]
        + '></a>';
      return new Response(response, {
        headers: {
          "content-type": "text/html",
        },
      });
    }
  }
};

function parseLine(line, base) {
  line = line.trim();
  if (line.startsWith("#")) {
    return null;
  }

  const parts = /(\S+)(?:\s+(\S+)(?:\s+(.*))?)?/.exec(line);
  if (!parts) {
    return null;
  }

  const nested = !parts[2];
  const url = new URL(parts[1], base).toString();
  const img = parts[2] ? new URL(parts[2], base).toString() : "";
  const alt = parts[3] || "";

  return { url, img, alt, nested };
}

function accept(choice, seen) {
  if (!choice) {
    return false;
  }

  if (choice.nested && seen.includes(choice.url)) {
    return false;
  }

  return true;
}

function escapeAttribute(s) {
  return s.replace(/["&]/g, match => ({ '"': "&quot;", "&": "&amp;" }[match]));
}
