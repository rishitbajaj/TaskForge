import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from './TaskCard';

const task = {
  _id: '507f1f77bcf86cd799439011',
  title: 'Sample task',
  description: 'Task details',
  priority: 'HIGH',
  status: 'TODO',
};

test('renders task title and priority', () => {
  render(<TaskCard task={task} onDelete={() => {}} onDragStart={() => {}} />);

  expect(screen.getByText('Sample task')).toBeInTheDocument();
  expect(screen.getByText('HIGH')).toBeInTheDocument();
});

test('calls onDelete when delete button is clicked', () => {
  const onDelete = jest.fn();
  render(<TaskCard task={task} onDelete={onDelete} onDragStart={() => {}} />);

  fireEvent.click(screen.getByRole('button', { name: /delete task/i }));
  expect(onDelete).toHaveBeenCalledWith(task._id);
});
