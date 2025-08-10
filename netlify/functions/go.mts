import { fetchWithCache } from "@netlify/cache";
import type { Context } from "@netlify/functions";

export const config: Config = {
  path: "/go/*"
};

export default async (req: Request, context: Context) => {
  let url = context.params[0];
  let seen = [];
  while (seen.length < 10) {
    seen.push(url);
    const request = new Request(url);
    const cached = await fetchWithCache(request);
    const body = await cached.text();
    const lines = body.split(/\r?\n/);
    const choices = Array.from(
      Iterator.from(lines).map(parseLine).filter((choice) => accept(choice, seen))
    );
    // console.log(choices);
    const chosen = choices[Math.floor(Math.random() * choices.length)];
    if (!chosen.nested) {
      return new Response(null, {
        status: 302,
        headers: {
          location: chosen.url,
        },
      });
    }
    url = chosen.url;
  }
};

function parseLine(line) {
  line = line.trim();
  if (line.length == 0 || line.startsWith("#")) {
    return null;
  }

  let nested = false;
  if (line.startsWith("+")) {
    nested = true;
    line = line.substring(1).trim();
  }

  return { url: line, nested: nested };
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
