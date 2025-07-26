<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UsersController;
use App\Http\Controllers\Api\ClassController;
use App\Http\Controllers\Api\TeachersController;
use App\Http\Controllers\Api\StudentsController;
use App\Http\Controllers\Api\ClassStudentTeacherController;

Route::post('/login', [UsersController::class, 'login']);
Route::apiResource('users', UsersController::class);
Route::apiResource('class', ClassController::class);
Route::apiResource('teacher', TeachersController::class);
Route::apiResource('students', StudentsController::class);

Route::middleware('auth:sanctum')->group(function() {
    Route::get('/user', function(Request $request) {
        return $request->user();
    });
});

Route::get('/', function () {
    return response()->json(['message' => 'Wrong site!'], 404);
});
