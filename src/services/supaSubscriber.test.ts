import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { Subscriber } from "../types/subscriber";
import { subscriberService } from "./supaSubscriber";

vi.mock("../lib/supabase", () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
    },
  },
}));

const mockUser: User = {
  id: "user-123",
  app_metadata: {},
  user_metadata: {},
  aud: "authenticated",
  created_at: "2026-08-20T10:00:00Z",
};

const mockSubscribers: Subscriber[] = [
  {
    id: 1,
    email: "mimi@example.com",
  },
  {
    id: 2,
    email: "john@example.com",
  },
];

/**
 * Supabase's from() returns a large PostgrestQueryBuilder.
 * For unit tests we only need to mock the methods used by the service.
 */
type SupabaseFromMock = ReturnType<typeof supabase.from>;

function mockSupabaseFrom(value: object) {
  vi.mocked(supabase.from).mockReturnValue(
    value as unknown as SupabaseFromMock
  );
}

/**
 * Mock Supabase auth.getUser().
 *
 * Using unknown here is intentional because the test
 * needs to simulate both User and null, while the
 * Supabase generated type may not accept null directly.
 */
function mockGetUser(user: User | null) {
  vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
    data: {
      user,
    },
    error: null,
  } as unknown as Awaited<ReturnType<typeof supabase.auth.getUser>>);
}

describe("subscriberService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --------------------------------------------------
  // getSubscribers
  // --------------------------------------------------

  describe("getSubscribers", () => {
    it("should return subscribers", async () => {
      const order = vi.fn().mockResolvedValue({
        data: mockSubscribers,
        error: null,
      });

      const select = vi.fn().mockReturnValue({
        order,
      });

      mockSupabaseFrom({
        select,
      });

      const result = await subscriberService.getSubscribers();

      expect(supabase.from).toHaveBeenCalledWith("subscribers");

      expect(select).toHaveBeenCalledWith("*");

      expect(order).toHaveBeenCalledWith("created_at", {
        ascending: false,
      });

      expect(result).toEqual(mockSubscribers);
    });

    it("should throw when fetching subscribers fails", async () => {
      const error = new Error("Failed to fetch subscribers");

      const order = vi.fn().mockResolvedValue({
        data: null,
        error,
      });

      const select = vi.fn().mockReturnValue({
        order,
      });

      mockSupabaseFrom({
        select,
      });

      await expect(subscriberService.getSubscribers()).rejects.toThrow(
        "Failed to fetch subscribers"
      );
    });
  });

  // --------------------------------------------------
  // addSubscriber
  // --------------------------------------------------

  describe("addSubscriber", () => {
    it("should throw when user is not signed in", async () => {
      mockGetUser(null);

      await expect(
        subscriberService.addSubscriber("mimi@example.com")
      ).rejects.toThrow("Please sign in first!");

      expect(supabase.auth.getUser).toHaveBeenCalledTimes(1);

      expect(supabase.from).not.toHaveBeenCalled();
    });

    it("should add and return a subscriber", async () => {
      mockGetUser(mockUser);

      const newSubscriber: Subscriber = {
        id: 3,
        email: "new@example.com",
      };

      const single = vi.fn().mockResolvedValue({
        data: newSubscriber,
        error: null,
      });

      const select = vi.fn().mockReturnValue({
        single,
      });

      const insert = vi.fn().mockReturnValue({
        select,
      });

      mockSupabaseFrom({
        insert,
      });

      const result = await subscriberService.addSubscriber("new@example.com");

      expect(supabase.auth.getUser).toHaveBeenCalledTimes(1);

      expect(supabase.from).toHaveBeenCalledWith("subscribers");

      expect(insert).toHaveBeenCalledWith({
        email: "new@example.com",
      });

      expect(select).toHaveBeenCalledTimes(1);

      expect(single).toHaveBeenCalledTimes(1);

      expect(result).toEqual(newSubscriber);
    });

    it("should throw when adding subscriber fails", async () => {
      mockGetUser(mockUser);

      const error = new Error("Failed to add subscriber");

      const single = vi.fn().mockResolvedValue({
        data: null,
        error,
      });

      const select = vi.fn().mockReturnValue({
        single,
      });

      const insert = vi.fn().mockReturnValue({
        select,
      });

      mockSupabaseFrom({
        insert,
      });

      await expect(
        subscriberService.addSubscriber("new@example.com")
      ).rejects.toThrow("Failed to add subscriber");
    });
  });

  // --------------------------------------------------
  // updateSubscriber
  // --------------------------------------------------

  describe("updateSubscriber", () => {
    it("should update and return a subscriber", async () => {
      const updatedSubscriber: Subscriber = {
        id: 1,
        email: "updated@example.com",
      };

      const single = vi.fn().mockResolvedValue({
        data: updatedSubscriber,
        error: null,
      });

      const select = vi.fn().mockReturnValue({
        single,
      });

      const eq = vi.fn().mockReturnValue({
        select,
      });

      const update = vi.fn().mockReturnValue({
        eq,
      });

      mockSupabaseFrom({
        update,
      });

      const result = await subscriberService.updateSubscriber(1, {
        email: "updated@example.com",
      });

      expect(supabase.from).toHaveBeenCalledWith("subscribers");

      expect(update).toHaveBeenCalledWith({
        email: "updated@example.com",
      });

      expect(eq).toHaveBeenCalledWith("id", 1);

      expect(select).toHaveBeenCalledTimes(1);

      expect(single).toHaveBeenCalledTimes(1);

      expect(result).toEqual(updatedSubscriber);
    });

    it("should throw when updating subscriber fails", async () => {
      const error = new Error("Failed to update subscriber");

      const single = vi.fn().mockResolvedValue({
        data: null,
        error,
      });

      const select = vi.fn().mockReturnValue({
        single,
      });

      const eq = vi.fn().mockReturnValue({
        select,
      });

      const update = vi.fn().mockReturnValue({
        eq,
      });

      mockSupabaseFrom({
        update,
      });

      await expect(
        subscriberService.updateSubscriber(1, {
          email: "updated@example.com",
        })
      ).rejects.toThrow("Failed to update subscriber");
    });
  });

  // --------------------------------------------------
  // deleteSubscriber
  // --------------------------------------------------

  describe("deleteSubscriber", () => {
    it("should delete a subscriber", async () => {
      const eq = vi.fn().mockResolvedValue({
        error: null,
      });

      const deleteMock = vi.fn().mockReturnValue({
        eq,
      });

      mockSupabaseFrom({
        delete: deleteMock,
      });

      await subscriberService.deleteSubscriber(1);

      expect(supabase.from).toHaveBeenCalledWith("subscribers");

      expect(deleteMock).toHaveBeenCalledTimes(1);

      expect(eq).toHaveBeenCalledWith("id", 1);
    });

    it("should throw when deleting subscriber fails", async () => {
      const error = new Error("Failed to delete subscriber");

      const eq = vi.fn().mockResolvedValue({
        error,
      });

      const deleteMock = vi.fn().mockReturnValue({
        eq,
      });

      mockSupabaseFrom({
        delete: deleteMock,
      });

      await expect(subscriberService.deleteSubscriber(1)).rejects.toThrow(
        "Failed to delete subscriber"
      );
    });
  });
});
