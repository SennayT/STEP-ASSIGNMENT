import React from "react";

const RemainingTodos = ({ count }: { count: number }) => {
  const suffix = count === 1 ? "" : "s";
  return (
    <div className="todo-count">
      <h5>Remaining todos</h5>
      <strong>{count}</strong> item{suffix} left
    </div>
  );
};

export default RemainingTodos;