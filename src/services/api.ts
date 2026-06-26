const TIMEOUT_MS = 5000;

export type VolumeAction =
  | { type: 'GET' }
  | { type: 'SET'; level: number }
  | { type: 'UP'; level: number }
  | { type: 'DOWN'; level: number };

export type PlayerAction =
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'STOP' };

export type SystemAction =
  | { type: 'SHUTDOWN'; confirm: boolean }
  | { type: 'REBOOT'; confirm: boolean };

export interface ValidationError {
  propertyName: string;
  message: string;
}

export interface ProxyError {
  title: string;
  detail: string;
  statusCode: number;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public detail: string,
    public validationErrors?: ValidationError[],
  ) {
    super(detail);
    this.name = 'ApiError';
  }
}

async function request<T>(baseUrl: string, path: string, body: unknown): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (res.ok) {
      return (await res.json()) as T;
    }

    if (res.status === 400) {
      const errors = (await res.json()) as ValidationError[];
      throw new ApiError(400, errors.map((e) => e.message).join(', '), errors);
    }

    if (res.status === 502) {
      const err = (await res.json()) as ProxyError;
      throw new ApiError(502, err.detail);
    }

    throw new ApiError(res.status, `Unexpected error (${res.status})`);
  } catch (e: unknown) {
    if (e instanceof ApiError) throw e;
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new ApiError(0, 'Request timed out. Ensure the proxy is running.');
    }
    throw new ApiError(0, 'Cannot reach proxy. Check the IP address and ensure the proxy is running.');
  } finally {
    clearTimeout(timeout);
  }
}

export function getVolume(baseUrl: string): Promise<number> {
  return request<number>(baseUrl, '/api/volume', { type: 'GET' });
}

export function setVolume(baseUrl: string, level: number): Promise<number> {
  return request<number>(baseUrl, '/api/volume', { type: 'SET', level });
}

export function volumeUp(baseUrl: string, step: number): Promise<number> {
  return request<number>(baseUrl, '/api/volume', { type: 'UP', level: step });
}

export function volumeDown(baseUrl: string, step: number): Promise<number> {
  return request<number>(baseUrl, '/api/volume', { type: 'DOWN', level: step });
}

export function playerPlay(baseUrl: string): Promise<void> {
  return request<void>(baseUrl, '/api/player', { type: 'PLAY' });
}

export function playerPause(baseUrl: string): Promise<void> {
  return request<void>(baseUrl, '/api/player', { type: 'PAUSE' });
}

export function playerStop(baseUrl: string): Promise<void> {
  return request<void>(baseUrl, '/api/player', { type: 'STOP' });
}

export function testConnection(baseUrl: string): Promise<boolean> {
  return getVolume(baseUrl).then(() => true);
}
