import { HttpError } from "./errors";

export function ok(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export function fail(err: unknown) {
  if (err instanceof HttpError) {
    return Response.json({ message: err.message }, { status: err.status });
  }

  if (err instanceof Error) {
    return Response.json({ message: err.message }, { status: 400 });
  }

  return Response.json({ message: "Server Error" }, { status: 500 });
}