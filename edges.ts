/*
 * Deployed via:
 * DENO_DEPLOY_TOKEN=... deployctl deploy --project=free-donkey-56 --prod edges.ts
 */
import { serve } from 'https://deno.land/std@0.155.0/http/server.ts'

// Given a nmuber of nodes, calculate the possible edges between them all.
const edgeCount = (nodes: number = 0): string => {
  if (nodes <= 1) {
    return `No edges exist for ${nodes} node(s)!`;
  }
  let numNodes = nodes;
  let edges = 0;
  // For n number of nodes, each node adds n-1 edges to the graph.
  for (numNodes; numNodes > 0; numNodes--) {
    edges += (numNodes - 1);
  }
  return `${nodes} nodes have up to ${edges} edges.`;
}

serve(async (req) => {
  let resp;
  const url = new URL(req.url);
  const helpMessage = `Try something like ${url.protocol}//${url.host}/nodes/42`;

  const pattern = new URLPattern({ pathname: '/nodes/:number'})
  // Does the path match our intended dynamic route?
  const match = pattern.exec(req.url);
  if (match) {
    const numParam = match.pathname.groups.number;
    let nodeNumber = Number(numParam);
    if (nodeNumber) {
      if (nodeNumber > 1000000) {
        resp = `Golly, ${nodeNumber} sure is a lot of nodes!`;
        nodeNumber = 1000000;
        resp += `\nI'm limiting the number to ${nodeNumber}...\n`;
        resp += edgeCount(nodeNumber);
      } else {
        resp = edgeCount(nodeNumber);
      }
    } else {
      resp = `Not so fast, Jack! '${numParam}' is not a number!`;
      resp += `\n${helpMessage}`;
    }
  } else {
    resp = helpMessage;
  }

  // Plain old text response.
  return new Response(resp, {
    status: 200,
  });
});
