## Finding: TaskBoard misses projectId in useEffect dependency array

- Location: frontend/src/components/TaskBoard.tsx
- Status: fixed
- Evidence: `useEffect(() => { getTasks(projectId)... }, [])` had an empty dependency array. Tasks were fetched only once on initial mount and never re-fetched when selecting another project.
- Impact: Users could only view tasks for the first project clicked; clicking other projects made no API call and showed stale tasks.
- Priority: High
- Proposed solution: Add `projectId` to the `useEffect` dependency array (`[projectId]`) and guard against empty/null `projectId`.
- Verification: Selecting different projects in the sidebar triggers `GET /api/projects/:id/tasks` and updates the board with the correct tasks.
- Implementation notes: Also updated task list item keys to use unique `task.id` instead of array index.

## Finding: Task titles not rendered in TaskItem

- Location: frontend/src/components/TaskItem.tsx
- Status: fixed
- Evidence: `<span className="task-title">{task.name}</span>` referenced `task.name`, but the backend Task entity property is `title`.
- Impact: Task titles appeared blank in the UI.
- Priority: High
- Proposed solution: Render `{task.title || task.name}` to align with backend entity schema.
- Verification: Task cards now display the task titles correctly.
- Implementation notes: Fallback to `task.name` preserved for backward compatibility.

## Finding: Task status toggle does not update UI state

- Location: frontend/src/components/TaskBoard.tsx
- Status: fixed
- Evidence: `handleToggle` mutated `task.status` directly and called `setTasks(tasks)`. Since the array reference did not change, React skipped re-rendering.
- Impact: Clicking Complete or Reopen did not reflect the updated status immediately in the UI.
- Priority: Medium
- Proposed solution: Update state immutably using `.map()` with the updated task returned by `updateTaskStatus`.
- Verification: Clicking Complete/Reopen toggles the task card badge and button label immediately.
- Implementation notes: Added catch block for API error handling.

## Finding: Missing empty state in TaskBoard for projects with zero tasks

- Location: frontend/src/components/TaskBoard.tsx
- Status: fixed
- Evidence: Selecting a project with zero tasks (such as "Marketing Site Q3", which has no tasks seeded in the database) returns HTTP 200 with an empty array `[]` from `GET /api/projects/:id/tasks`. The UI displayed `Tasks 0` with a blank screen below it.
- Impact: Confusing user experience; unclear whether tasks failed to load or none existed.
- Priority: Medium
- Proposed solution: Conditionally render an `<div className="empty-state">` message when `tasks.length === 0`.
- Verification: Clicking "Marketing Site Q3" now displays a clear "No tasks yet for this project." placeholder using existing styling.
- Implementation notes: Reused existing `.empty-state` class defined in `index.css`.

## Finding: Missing React type definitions caused TypeScript errors across frontend

- Location: frontend/ (all TSX files: `main.tsx`, `App.tsx`, `TaskBoard.tsx`, `TaskItem.tsx`, `ProjectList.tsx`)
- Status: fixed
- Evidence: IDE and compiler reported missing type definitions and JSX errors (e.g. `This JSX tag requires the module path 'react/jsx-runtime'`).
- Impact: Static type checking failed and IDE showed error squiggles across all frontend components.
- Priority: Medium
- Proposed solution: Install the required TypeScript declaration packages (`@types/react` and `@types/react-dom`).
- Verification: Installed `@types/react` and `@types/react-dom`; type errors and JSX resolution warnings are fully resolved across all frontend files.
- Implementation notes: Installed via npm in `frontend/`.
