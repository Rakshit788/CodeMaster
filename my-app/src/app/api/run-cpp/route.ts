import { jobQueue } from '../../lib/queue/codequeue';
import { NextResponse } from 'next/server'
import { v4 as uuid } from 'uuid';

export async function POST(req) {
  const { code } = await req.json();
  const jobId = uuid();

  // 1) Enqueue a new job with our code payload
await jobQueue.add('run-cpp', { code: code , jobId:jobId }, { jobId : jobId });


  // 2) Immediately return the job ID to the client
  return NextResponse.json({ status: 'queued', jobId });
}