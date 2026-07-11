<?php

namespace App\Services;

use App\Models\Task;

class TaskService
{
    public function create(array $payload): Task
    {
        return Task::query()->create([
            'title' => $payload['title'],
            'description' => $payload['description'] ?? null,
            'is_completed' => $payload['is_completed'] ?? false,
        ]);
    }

    public function update(Task $task, array $payload): Task
    {
        $task->update([
            'title' => $payload['title'] ?? $task->title,
            'description' => array_key_exists('description', $payload) ? $payload['description'] : $task->description,
            'is_completed' => $payload['is_completed'] ?? $task->is_completed,
        ]);

        return $task->refresh();
    }

    public function delete(Task $task): void
    {
        $task->delete();
    }
}
