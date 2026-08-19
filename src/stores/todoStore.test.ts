import { useTodoStore } from "./todoStore";
import type { Todo } from "../types/todo";

describe("todoStore", () => {
  beforeEach(() => {
    localStorage.clear();

    useTodoStore.setState({
      todos: [
        { id: 0, text: "My Neighbor Totoro (1988)", done: false },
        { id: 1, text: "Cats (1998)", done: false },
      ],
    });
  });

  it("should have initial todos", () => {
    const todos = useTodoStore.getState().todos;

    expect(todos).toHaveLength(2);
    expect(todos[0].text).toBe("My Neighbor Totoro (1988)");
  });

  it("should add a todo", () => {
    vi.spyOn(Date, "now").mockReturnValue(100);

    useTodoStore.getState().addTodo("New Todo");

    const todos = useTodoStore.getState().todos;

    expect(todos).toHaveLength(3);

    expect(todos[2]).toEqual({
      id: 100,
      text: "New Todo",
      done: false,
    });

    vi.restoreAllMocks();
  });

  it("should toggle todo status", () => {
    useTodoStore.getState().toggleTodo(0);

    const todo = useTodoStore.getState().todos[0];

    expect(todo.done).toBe(true);

    useTodoStore.getState().toggleTodo(0);

    expect(useTodoStore.getState().todos[0].done).toBe(false);
  });

  it("should edit a todo", () => {
    useTodoStore.getState().editTodo(0, "Updated Todo");

    const todo = useTodoStore.getState().todos[0];

    expect(todo.text).toBe("Updated Todo");
  });

  it("should delete a todo", () => {
    useTodoStore.getState().deleteTodo(0);

    const todos = useTodoStore.getState().todos;

    expect(todos).toHaveLength(1);
    expect(todos.find((todo: Todo) => todo.id === 0)).toBeUndefined();
  });
});
