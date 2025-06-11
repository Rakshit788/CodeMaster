import { jobQueue } from '../../../../../lib/queue/codequeue';
import { NextResponse } from 'next/server';

export async function GET(req: Request, context: { params: { jobId: string } }) {
  const jobId = context.params.jobId;
  console.log(`Checking status for job ID: ${jobId}`);
  
  if (typeof jobId !== 'string' || !jobId) {
    return NextResponse.json({ status: 'error', message: 'Invalid job ID' }, { status: 400 });
  }

  const job = await jobQueue.getJob(jobId);
  console.log(`Retrieved job: ${JSON.stringify(job)}`);
  
  if (!job) {
    return NextResponse.json({ status: 'not_found' }, { status: 404 });
  }

  const state = await job.getState();
  const result = state === 'completed' ? job.returnvalue : null;

  return NextResponse.json({ jobId, state, result });
}
