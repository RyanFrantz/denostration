/* Deployed via
 *  DENO_DEPLOY_TOKEN=... deployctl deploy --project=relocate --prod relocate.ts
 */
import { serve } from 'https://deno.land/std@0.155.0/http/server.ts'
import { getCookies } from "https://deno.land/std/http/cookie.ts";

// A very basic HTTP router.
serve(async (req) => {
  const host = req.headers.get('host');
  const cookies = getCookies(req.headers);
  const hasValidCookie = cookies.shibboleth == 'true';

  if (host == 'www.lumosity.com') {
    if (hasValidCookie) {
      return new Response('', {
        status: 302,
        headers: {
          'Location': 'beta.lumosity.com'
        }
      });
    }
    // No-op, but pretend at this point we proxied the request to
    // www.lumosity.com rather than redirecting the user agent.
    return new Response('www.lumosity.com', {
      status: 200
    });
  }

  // Default response.
  return new Response('You found me!', {
    status: 200,
  });
});
