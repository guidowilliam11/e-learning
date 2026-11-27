import { LuCheck } from 'react-icons/lu'

const AssignmentList = ({
  curr,
  assignmentId,
  title,
  isEditing = false,
  checked,
  handleCheck,
  onLabelChange,
  onSave,
  cancelAdd,
  handleViewAssignment,
}) => {
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') onSave()
    else if (event.key === 'Escape') cancelAdd()
  }

  if (isEditing) {
    return (
      <input
        value={title}
        onChange={onLabelChange}
        onKeyDown={handleKeyPress}
        onBlur={() => !title && cancelAdd()}
        placeholder='Task title, then Enter'
        aria-label='New task title'
        autoFocus
        className='w-full h-9 px-3 my-1 text-sm bg-white border rounded-md border-accent focus:outline-none'
      />
    )
  }

  return (
    <div className='flex items-center gap-3 px-3 py-2 my-1 bg-white border rounded-md border-line group hover:border-zinc-300'>
      <button
        role='checkbox'
        aria-checked={!!checked}
        aria-label={`Mark "${title}" ${checked ? 'not done' : 'done'}`}
        onClick={() => handleCheck(curr)}
        className={`grid size-[18px] shrink-0 place-items-center rounded-full border ${checked ? 'bg-accent border-accent text-white' : 'border-zinc-300 hover:border-accent'}`}
      >
        {checked && <LuCheck size={11} strokeWidth={3} />}
      </button>
      <button
        onClick={() => handleViewAssignment(assignmentId)}
        className={`flex-1 min-w-0 text-left text-sm truncate hover:text-accent ${checked ? 'line-through text-ink-3' : ''}`}
      >
        {title}
      </button>
    </div>
  )
}

export default AssignmentList
