import { NextResponse, type NextRequest } from "next/server";
import { proxyTemplate } from "@/features/plan-template/api/template-proxy.server";
interface Context {
  params: Promise<{ id: string }>;
}
export async function GET(request: NextRequest, context: Context) {
  const { id } = await context.params;
  const version = request.nextUrl.searchParams.get("version");
  const day = request.nextUrl.searchParams.get("day");
  const page = request.nextUrl.searchParams.get("page") ?? "0";
  if (
    (version !== null &&
      (!/^\d+$/.test(version) ||
        Number(version) < 1 ||
        Number(version) > 2147483647)) ||
    !/^[a-zA-Z0-9]{1,64}$/.test(id) ||
    !day ||
    !/^\d+$/.test(day) ||
    Number(day) < 1 ||
    Number(day) > 366 ||
    !/^\d+$/.test(page) ||
    Number(page) > 5000
  ) {
    return NextResponse.json(
      { status: 400, message: "Invalid template map request", data: null },
      { status: 400 },
    );
  }
  return proxyTemplate(request, `public/plan-templates/${id}/map`, true);
}
