// Public, approximate Hubb server counts. No Discord bot token required.
// Netlify deploys this file as a serverless function automatically.
export default async function handler(request) {
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { 'content-type': 'application/json', allow: 'GET' }
    });
  }

  try {
    const response = await fetch('https://discord.com/api/v10/invites/hubb?with_counts=true', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'HubbCommunityWebsite/1.0 (https://joinhubb.online)'
      },
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) throw new Error(`Discord API returned HTTP ${response.status}`);
    const invite = await response.json();
    const members = invite.approximate_member_count;
    const online = invite.approximate_presence_count;
    if (!Number.isInteger(members) || members < 0 || !Number.isInteger(online) || online < 0) {
      throw new Error('Discord did not return valid counts');
    }
    return new Response(JSON.stringify({ members, online, updatedAt: new Date().toISOString() }), {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
        'x-content-type-options': 'nosniff'
      }
    });
  } catch (error) {
    console.error('Discord stats fetch error:', error.message);
    return new Response(JSON.stringify({ error: 'Discord stats temporarily unavailable' }), {
      status: 503,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
        'x-content-type-options': 'nosniff'
      }
    });
  }
}
