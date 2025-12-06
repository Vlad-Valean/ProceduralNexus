const API_URL = 'http://localhost:8080/auth'; 

export type LoginRequest = {
  email: string;
  password: string;
};

export type JwtResponse = {
  token: string;
  id: number;
  email: string;
  roles: string[];
};

export type RegisterRequest = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role?: string[]; 
};

export async function loginApi(body: LoginRequest): Promise<JwtResponse> {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Login failed with status ${res.status}`);
  }

  return res.json();
}

export async function registerApi(body: RegisterRequest): Promise<string> {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Register failed with status ${res.status}`);
  }

  return data.message ?? 'Registered successfully';
}
