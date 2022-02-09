import { log } from "console";
import React from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  colorFilterChanged,
  statusFilterChanged,
} from "../filters/filterSlice";
import {
  allTodosCompleted,
  completedTodosCleared,
  selectTodos,
} from "../todos/TodosSlice";
import ColorFilters from "./ColorFilters";
import RemainingTodos from "./RemainingTodos";
import StatusFilter from "./StatusFilter";

const Footer = () => {
  const dispatch = useAppDispatch();
  const todosRemaining = useAppSelector((state) => {
    const uncompletedTodos = selectTodos(state).filter(
      (todo) => !todo.completed
    );
    return uncompletedTodos.length;
  });

  const { status, colors } = useAppSelector((state) => state.filters);
  const onStatusChange = (status: string) =>
    dispatch(statusFilterChanged(status));
  const onColorChange = (color: string, changeType: string) =>
    dispatch(colorFilterChanged(color, changeType));

  const onMarkAllCompleted = () => {
    dispatch(allTodosCompleted());
  };
  const onClearCompleted = () => dispatch(completedTodosCleared());

  return (
    <footer className="footer">
      <div className="actions">
        <h5>Actions</h5>
        <button className="button" onClick={onMarkAllCompleted}>
          Mark All Completed
        </button>
        <button className="button" onClick={onClearCompleted}>
          Clear Completed
        </button>
      </div>
      <RemainingTodos count={todosRemaining} />
      <StatusFilter value={status} onChange={onStatusChange} />
      <ColorFilters value={colors} onChange={onColorChange} />
    </footer>
  );
};

export default Footer;