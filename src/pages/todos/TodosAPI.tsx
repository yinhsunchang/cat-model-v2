import { supabase } from "../../lib/supabase";
import type { Todo } from "../../types/todo";

type TodoUpdate = Partial<Pick<Todo, "text" | "done">>;

const API_URL = `${import.meta.env.VITE_API_URL}/todos`;

async function getToken(): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Not authenticated");
  }

  return session.access_token;
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();

  const headers = new Headers(options.headers);

  headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = `HTTP Error: ${res.status}`;

    try {
      const data = await res.json();

      if (data?.detail) {
        message = data.detail;
      } else if (data?.message) {
        message = data.message;
      }
    } catch {
      // Response body is not JSON.
    }

    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export const TodosAPI = {
  getTodos(): Promise<Todo[]> {
    return request<Todo[]>(API_URL);
  },

  create(text: string): Promise<Todo> {
    return request<Todo>(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        done: false,
      }),
    });
  },

  delete(id: number): Promise<void> {
    return request<void>(`${API_URL}/${id}`, {
      method: "DELETE",
    });
  },

  update(id: number, data: TodoUpdate): Promise<Todo> {
    return request<Todo>(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },
};
