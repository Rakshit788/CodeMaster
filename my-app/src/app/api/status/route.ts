import { NextResponse } from 'next/server';
import { jobQueue } from '../../lib/queue/codequeue';

export async function GET(req: Request) {
  // 1. Read the "key" param from ?key=...
  const url = new URL(req.url);
  const jobId = url.searchParams.get('key');

  if (!jobId) {
    return NextResponse.json(
      { status: 'error', message: 'Missing key parameter' },
      { status: 400 }
    );
  }

  console.log('🔍 Checking status for jobId=', jobId);

  // 2. Fetch the job
  const job = await jobQueue.getJob(jobId);
  console.log('📦 jobQueue.getJob returned:', job);

  if (!job) {
    return NextResponse.json({ status: 'not_found' }, { status: 404 });
  }

  // 3. Determine state and result
  const state = await job.getState();
  const result = state === 'completed' ? job.returnvalue : null;

  return NextResponse.json({ jobId, state, result });
}
