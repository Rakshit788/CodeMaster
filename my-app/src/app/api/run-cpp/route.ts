import os from 'os';
import path from 'path';
import fs from 'fs/promises';
import { execFile } from 'child_process';
import { v4 as uuid } from 'uuid';
import { NextResponse } from 'next/server';


function normalizeForDocker(hostPath: string): string {
  // Turn "C:\Users\…" into "/c/Users/…"
  let p = hostPath.replace(/\\/g, '/');
  const m = /^([A-Za-z]):\//.exec(p);
  if (m) {
    const drive = m[1].toLowerCase();
    p = `/${drive}${p.slice(2)}`;
  }
  return p;
}

export async function POST(req: Request) {
  const { code } = await req.json();
  if (typeof code !== 'string') {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  // 1) Create a real Windows/OS temp folder
  const id = uuid();
  console.log(`Creating temporary folder for judge: ${id}`);
  const workDir = path.join(os.tmpdir(), id);
  await fs.mkdir(workDir, { recursive: true });

  // 2) Write the user code
  const sourceFile = path.join(workDir, 'solution.cpp');
  await fs.writeFile(sourceFile, code);

  // 3) Normalize path for Docker bind-mount
  const hostMount = normalizeForDocker(workDir);

  // 4) Run the judge container
  const result = await new Promise<any>(resolve => {
    execFile(
      'docker',
      [
        'run',
        '--rm',
        '-v', `${hostMount}:/usr/src/app`,
        'judge-cpp:latest',
        'solution.cpp'          // THIS is $1 inside runner.sh
      ],
      { timeout: 30_000, maxBuffer: 1024 * 1024 },
      async (err, stdout, stderr) => {
        // clean up the temp folder
        await fs.rm(workDir, { recursive: true, force: true });

        // if Docker itself fails
        if (err && !stdout) {
          return resolve({ status: 'error', message: stderr || err.message });
        }

        // parse the JSON our runner.sh printed
        try {
          return resolve(JSON.parse(stdout));
        } catch (e) {
          return resolve({
            status: 'error',
            message: 'Invalid judge response',
            raw: stdout || stderr
          });
        }
      }
    );
  });

  return NextResponse.json(result);
}
