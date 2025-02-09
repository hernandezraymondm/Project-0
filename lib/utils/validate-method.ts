import { NextRequest, NextResponse } from "next/server";
import { ErrorCode } from "../enums/error-code.enum";
import { HttpStatus } from "@/config/http.config";

export function validateMethod(req: NextRequest, allowedMethod: string) {
  if (req.method !== allowedMethod.toUpperCase()) {
    return NextResponse.json(
      { error: ErrorCode.METHOD_NOT_ALLOWED },
      { status: HttpStatus.METHOD_NOT_ALLOWED },
    );
  }
  return null; // Return null if method is allowed
}
