import { NextRequest, NextResponse } from 'next/server';
import { SandboxProvider } from '@/lib/sandbox/types';

// Get active sandbox provider from global state
declare global {
  var activeSandboxProvider: SandboxProvider | null;
}

export async function POST(request: NextRequest) {
  try {
    const { command } = await request.json();
    
    if (!command) {
      return NextResponse.json({ 
        success: false, 
        error: 'Command is required' 
      }, { status: 400 });
    }
    
    if (!global.activeSandboxProvider) {
      return NextResponse.json({ 
        success: false, 
        error: 'No active sandbox' 
      }, { status: 400 });
    }
    
    console.log(`[run-command-v2] Executing: ${command}`);
    
    const result = await global.activeSandboxProvider.runCommand(command);
    
    return NextResponse.json({
      success: result.success,
      output: result.stdout,
      error: result.stderr,
      exitCode: result.exitCode,
      message: result.success ? 'Command executed successfully' : 'Command failed'
    });
    
  } catch (error) {
    console.error('[run-command-v2] Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: (error as Error).message 
    }, { status: 500 });
  }
}