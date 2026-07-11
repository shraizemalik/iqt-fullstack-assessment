<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Assessment User',
            'email' => 'assessment@example.com',
        ]);

        collect([
            [
                'title' => 'Review sprint backlog',
                'description' => 'Confirm priorities and move ready work into the current sprint.',
                'is_completed' => true,
            ],
            [
                'title' => 'Prepare API documentation',
                'description' => 'Document task endpoints, validation rules, and response formats.',
                'is_completed' => false,
            ],
            [
                'title' => 'Refine dashboard layout',
                'description' => 'Polish the task board UI for desktop and mobile breakpoints.',
                'is_completed' => false,
            ],
            [
                'title' => 'Verify database persistence',
                'description' => 'Confirm CRUD actions remain visible after a full page refresh.',
                'is_completed' => true,
            ],
            [
                'title' => 'Write release checklist',
                'description' => 'Capture deployment, smoke test, and rollback steps for the assessment handoff.',
                'is_completed' => false,
            ],
            [
                'title' => 'Clean up notification states',
                'description' => 'Make sure success and error feedback stays clear and consistent.',
                'is_completed' => false,
            ],
        ])->each(fn (array $task) => Task::query()->create($task));
    }
}
