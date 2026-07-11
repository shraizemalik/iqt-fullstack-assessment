<?php

namespace Tests\Feature;

use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_returns_paginated_tasks_with_search_and_status_filters(): void
    {
        Task::factory()->create([
            'title' => 'Plan sprint review',
            'is_completed' => true,
        ]);

        Task::factory()->create([
            'title' => 'Write API documentation',
            'is_completed' => false,
        ]);

        Task::factory()->create([
            'title' => 'Prepare release notes',
            'is_completed' => false,
        ]);

        $response = $this->getJson('/api/v1/tasks?search=write&status=pending&per_page=5');

        $response
            ->assertOk()
            ->assertJsonPath('message', 'Tasks retrieved successfully.')
            ->assertJsonPath('summary.total', 3)
            ->assertJsonPath('summary.completed', 1)
            ->assertJsonPath('summary.pending', 2)
            ->assertJsonPath('summary.filtered', 1)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Write API documentation')
            ->assertJsonStructure([
                'data',
                'links',
                'meta',
                'message',
                'summary',
            ]);
    }

    public function test_it_creates_a_task(): void
    {
        $response = $this->postJson('/api/v1/tasks', [
            'title' => 'Finish assessment backend',
            'description' => 'Implement and verify the Laravel API.',
            'is_completed' => false,
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('message', 'Task created successfully.')
            ->assertJsonPath('data.title', 'Finish assessment backend')
            ->assertJsonPath('data.is_completed', false);

        $this->assertDatabaseHas('tasks', [
            'title' => 'Finish assessment backend',
            'is_completed' => false,
        ]);
    }

    public function test_it_updates_a_task(): void
    {
        $task = Task::factory()->create([
            'title' => 'Initial task title',
            'is_completed' => false,
        ]);

        $response = $this->putJson("/api/v1/tasks/{$task->id}", [
            'title' => 'Updated task title',
            'is_completed' => true,
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('message', 'Task updated successfully.')
            ->assertJsonPath('data.title', 'Updated task title')
            ->assertJsonPath('data.is_completed', true);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Updated task title',
            'is_completed' => true,
        ]);
    }

    public function test_it_deletes_a_task(): void
    {
        $task = Task::factory()->create();

        $response = $this->deleteJson("/api/v1/tasks/{$task->id}");

        $response
            ->assertOk()
            ->assertJsonPath('message', 'Task deleted successfully.');

        $this->assertDatabaseMissing('tasks', [
            'id' => $task->id,
        ]);
    }
}
