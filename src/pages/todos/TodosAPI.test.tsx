import { supabase } from "../../lib/supabase";
import type { Todo } from "../../types/todo";
import { TodosAPI } from "./TodosAPI";

vi.mock("../../lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
  },
}));

const API_URL = `${import.meta.env.VITE_API_URL}/todos`;

const mockToken = "test-access-token";

const mockTodos: Todo[] = [
  {
    id: 1,
    text: "Learn Vitest",
    done: false,
  },
  {
    id: 2,
    text: "Learn RTL",
    done: true,
  },
];

function mockAuthenticatedSession() {
  vi.mocked(supabase.auth.getSession).mockResolvedValue({
    data: {
      session: {
        access_token: mockToken,
      },
    },
    error: null,
  } as Awaited<ReturnType<typeof supabase.auth.getSession>>);
}

function mockUnauthenticatedSession() {
  vi.mocked(supabase.auth.getSession).mockResolvedValue({
    data: {
      session: null,
    },
    error: null,
  } as Awaited<ReturnType<typeof supabase.auth.getSession>>);
}

function mockFetchResponse(data: unknown, status = 200) {
  vi.mocked(fetch).mockResolvedValue(
    new Response(JSON.stringify(data), {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    })
  );
}

describe("TodosAPI", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.stubGlobal("fetch", vi.fn());
  });

  // --------------------------------------------------
  // getTodos
  // --------------------------------------------------

  describe("getTodos", () => {
    it("gets todos with authorization header", async () => {
      mockAuthenticatedSession();

      mockFetchResponse(mockTodos);

      const result = await TodosAPI.getTodos();

      expect(result).toEqual(mockTodos);

      expect(supabase.auth.getSession).toHaveBeenCalledTimes(1);

      expect(fetch).toHaveBeenCalledTimes(1);

      const [url, options] = vi.mocked(fetch).mock.calls[0];

      expect(url).toBe(API_URL);

      expect(options?.headers).toBeInstanceOf(Headers);

      const headers = options?.headers as Headers;

      expect(headers.get("Authorization")).toBe(`Bearer ${mockToken}`);
    });

    it("throws when user is not authenticated", async () => {
      mockUnauthenticatedSession();

      await expect(TodosAPI.getTodos()).rejects.toThrow("Not authenticated");

      expect(supabase.auth.getSession).toHaveBeenCalledTimes(1);

      expect(fetch).not.toHaveBeenCalled();
    });

    it("throws when GET request fails", async () => {
      mockAuthenticatedSession();

      mockFetchResponse(
        {
          detail: "Failed to fetch todos",
        },
        500
      );

      await expect(TodosAPI.getTodos()).rejects.toThrow(
        "Failed to fetch todos"
      );

      expect(fetch).toHaveBeenCalledWith(
        API_URL,
        expect.objectContaining({
          headers: expect.any(Headers),
        })
      );
    });

    it("uses HTTP status when error response has no detail or message", async () => {
      mockAuthenticatedSession();

      vi.mocked(fetch).mockResolvedValue(
        new Response(
          JSON.stringify({
            error: "Something went wrong",
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      );

      await expect(TodosAPI.getTodos()).rejects.toThrow("HTTP Error: 500");
    });
  });

  // --------------------------------------------------
  // create
  // --------------------------------------------------

  describe("create", () => {
    it("creates a todo", async () => {
      mockAuthenticatedSession();

      const newTodo: Todo = {
        id: 3,
        text: "Learn TypeScript",
        done: false,
      };

      mockFetchResponse(newTodo, 201);

      const result = await TodosAPI.create("Learn TypeScript");

      expect(result).toEqual(newTodo);

      expect(fetch).toHaveBeenCalledTimes(1);

      const [url, options] = vi.mocked(fetch).mock.calls[0];

      expect(url).toBe(API_URL);

      expect(options?.method).toBe("POST");

      expect(options?.body).toBe(
        JSON.stringify({
          text: "Learn TypeScript",
          done: false,
        })
      );

      expect(options?.headers).toBeInstanceOf(Headers);

      const headers = options?.headers as Headers;

      expect(headers.get("Authorization")).toBe(`Bearer ${mockToken}`);

      expect(headers.get("Content-Type")).toBe("application/json");
    });

    it("throws when create request fails", async () => {
      mockAuthenticatedSession();

      mockFetchResponse(
        {
          detail: "Failed to create todo",
        },
        400
      );

      await expect(TodosAPI.create("Test todo")).rejects.toThrow(
        "Failed to create todo"
      );
    });
  });

  // --------------------------------------------------
  // update
  // --------------------------------------------------

  describe("update", () => {
    it("updates todo text", async () => {
      mockAuthenticatedSession();

      const updatedTodo: Todo = {
        id: 1,
        text: "Updated text",
        done: false,
      };

      mockFetchResponse(updatedTodo);

      const result = await TodosAPI.update(1, {
        text: "Updated text",
      });

      expect(result).toEqual(updatedTodo);

      expect(fetch).toHaveBeenCalledTimes(1);

      const [url, options] = vi.mocked(fetch).mock.calls[0];

      expect(url).toBe(`${API_URL}/1`);

      expect(options?.method).toBe("PATCH");

      expect(options?.body).toBe(
        JSON.stringify({
          text: "Updated text",
        })
      );

      expect(options?.headers).toBeInstanceOf(Headers);

      const headers = options?.headers as Headers;

      expect(headers.get("Authorization")).toBe(`Bearer ${mockToken}`);

      expect(headers.get("Content-Type")).toBe("application/json");
    });

    it("updates todo done state", async () => {
      mockAuthenticatedSession();

      const updatedTodo: Todo = {
        id: 1,
        text: "Learn Vitest",
        done: true,
      };

      mockFetchResponse(updatedTodo);

      const result = await TodosAPI.update(1, {
        done: true,
      });

      expect(result).toEqual(updatedTodo);

      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/1`,
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({
            done: true,
          }),
        })
      );
    });

    it("updates both text and done state", async () => {
      mockAuthenticatedSession();

      const updatedTodo: Todo = {
        id: 1,
        text: "Updated todo",
        done: true,
      };

      mockFetchResponse(updatedTodo);

      const result = await TodosAPI.update(1, {
        text: "Updated todo",
        done: true,
      });

      expect(result).toEqual(updatedTodo);

      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/1`,
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({
            text: "Updated todo",
            done: true,
          }),
        })
      );
    });

    it("throws when update request fails", async () => {
      mockAuthenticatedSession();

      mockFetchResponse(
        {
          message: "Failed to update todo",
        },
        400
      );

      await expect(
        TodosAPI.update(1, {
          done: true,
        })
      ).rejects.toThrow("Failed to update todo");
    });
  });

  // --------------------------------------------------
  // delete
  // --------------------------------------------------

  describe("delete", () => {
    it("deletes a todo", async () => {
      mockAuthenticatedSession();

      vi.mocked(fetch).mockResolvedValue(
        new Response(null, {
          status: 204,
        })
      );

      const result = await TodosAPI.delete(1);

      expect(result).toBeUndefined();

      expect(fetch).toHaveBeenCalledTimes(1);

      const [url, options] = vi.mocked(fetch).mock.calls[0];

      expect(url).toBe(`${API_URL}/1`);

      expect(options?.method).toBe("DELETE");

      expect(options?.headers).toBeInstanceOf(Headers);

      const headers = options?.headers as Headers;

      expect(headers.get("Authorization")).toBe(`Bearer ${mockToken}`);
    });

    it("throws when delete request fails", async () => {
      mockAuthenticatedSession();

      mockFetchResponse(
        {
          detail: "Failed to delete todo",
        },
        404
      );

      await expect(TodosAPI.delete(1)).rejects.toThrow("Failed to delete todo");
    });
  });

  // --------------------------------------------------
  // request error handling
  // --------------------------------------------------

  describe("error handling", () => {
    it("uses detail from error response", async () => {
      mockAuthenticatedSession();

      mockFetchResponse(
        {
          detail: "Todo not found",
        },
        404
      );

      await expect(TodosAPI.getTodos()).rejects.toThrow("Todo not found");
    });

    it("uses message from error response", async () => {
      mockAuthenticatedSession();

      mockFetchResponse(
        {
          message: "Server error",
        },
        500
      );

      await expect(TodosAPI.getTodos()).rejects.toThrow("Server error");
    });

    it("uses HTTP status when response body is not JSON", async () => {
      mockAuthenticatedSession();

      vi.mocked(fetch).mockResolvedValue(
        new Response("Internal Server Error", {
          status: 500,
          headers: {
            "Content-Type": "text/plain",
          },
        })
      );

      await expect(TodosAPI.getTodos()).rejects.toThrow("HTTP Error: 500");
    });

    it("does not call fetch when authentication fails", async () => {
      mockUnauthenticatedSession();

      await expect(TodosAPI.delete(1)).rejects.toThrow("Not authenticated");

      expect(fetch).not.toHaveBeenCalled();
    });
  });
});
