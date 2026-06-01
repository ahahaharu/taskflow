import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import type { Board } from "@/types";

vi.mock("@/services/boards", () => ({
  getBoards: vi.fn(),
  createBoard: vi.fn(),
  deleteBoard: vi.fn(),
  getBoard: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

import { getBoards, createBoard } from "@/services/boards";
import { useBoards, useCreateBoard } from "@/hooks/useBoards";
import { makeWrapper } from "@/test/queryWrapper";

const mockedGetBoards = vi.mocked(getBoards);
const mockedCreateBoard = vi.mocked(createBoard);

const sampleBoards: Board[] = [
  {
    id: "b1",
    title: "Alpha",
    owner_id: "u1",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "b2",
    title: "Beta",
    owner_id: "u1",
    created_at: "2026-02-01T00:00:00Z",
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useBoards", () => {
  it("returns boards from the service", async () => {
    mockedGetBoards.mockResolvedValueOnce(sampleBoards);
    const { Wrapper } = makeWrapper();

    const { result } = renderHook(() => useBoards(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(sampleBoards);
    expect(mockedGetBoards).toHaveBeenCalledTimes(1);
  });
});

describe("useCreateBoard", () => {
  it("calls the service and invalidates the boards query", async () => {
    const created: Board = {
      id: "b3",
      title: "Gamma",
      owner_id: "u1",
      created_at: "2026-03-01T00:00:00Z",
    };
    mockedCreateBoard.mockResolvedValueOnce(created);
    mockedGetBoards.mockResolvedValue(sampleBoards);

    const { Wrapper, client } = makeWrapper();
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useCreateBoard(), { wrapper: Wrapper });

    result.current.mutate("Gamma");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedCreateBoard).toHaveBeenCalledWith(
      "Gamma",
      expect.anything(),
    );
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["boards"] });
  });
});
