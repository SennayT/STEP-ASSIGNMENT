import React from "react";
import { useAppSelector } from "../../app/hooks";
import TodoListItem from "./TodoListItem";
import { selectFilteredTodoIds } from "./TodosSlice";

const TodoList = () => {
  const todoIds = useAppSelector(selectFilteredTodoIds);
  const loadingStatus = useAppSelector((state) => state.todos.status);

  if (loadingStatus === "loading") {
    return (
      <div className="todo-list">
        <div className="loader"></div>
      </div>
    );
  }

  const renderedListItems = todoIds.map((todoId) => {
    return <TodoListItem key={todoId} id={todoId} />;
  });

  return <ul className="todo-list">{renderedListItems}</ul>;
};

export default TodoList;