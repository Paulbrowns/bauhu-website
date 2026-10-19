// Compare dashboard bearer tokens without data-dependent early exit.
export async function authorised(request, env) {
  const secret = env.LEADS_DASHBOARD_TOKEN;
  if (!secret || typeof secret !== 'string') return false;
  const expected = new TextEncoder().encode(`Bearer ${secret}`);
  const supplied = new TextEncoder().encode(request.headers.get('authorization') || '');
  const length = Math.max(expected.length, supplied.length);
  let difference = expected.length ^ supplied.length;
  for (let i = 0; i < length; i++) {
    difference |= (expected[i] || 0) ^ (supplied[i] || 0);
  }
  return difference === 0;
}
