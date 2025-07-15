
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

export async function POST(request: Request) {
  const sub = await request.json();
  await prisma.pushSubscription.upsert({
    where: { endpoint: sub.endpoint },
    update: { keys: sub.keys },
    create: { endpoint: sub.endpoint, keys: sub.keys },
  });
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}