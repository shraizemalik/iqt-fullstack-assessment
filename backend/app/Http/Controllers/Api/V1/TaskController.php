<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Task\IndexTaskRequest;
use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Services\TaskService;
use Illuminate\Http\JsonResponse;

class TaskController extends Controller
{
    public function __construct(private readonly TaskService $taskService)
    {
    }

    public function index(IndexTaskRequest $request): JsonResponse
    {
        $filters = $request->validated();

        $tasks = Task::query()
            ->search($filters['search'] ?? null)
            ->status($filters['status'] ?? null)
            ->latest('created_at')
            ->paginate($filters['per_page'] ?? 10)
            ->withQueryString();

        return TaskResource::collection($tasks)
            ->additional([
                'message' => 'Tasks retrieved successfully.',
            ])
            ->response();
    }

    public function store(StoreTaskRequest $request): JsonResponse
    {
        $task = $this->taskService->create($request->validated());

        return TaskResource::make($task)
            ->additional([
                'message' => 'Task created successfully.',
            ])
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        $task = $this->taskService->update($task, $request->validated());

        return TaskResource::make($task)
            ->additional([
                'message' => 'Task updated successfully.',
            ])
            ->response();
    }

    public function destroy(Task $task): JsonResponse
    {
        $this->taskService->delete($task);

        return response()->json([
            'message' => 'Task deleted successfully.',
        ]);
    }
}
