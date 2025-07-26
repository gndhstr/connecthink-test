<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StudentsModel;

class StudentsController extends Controller
{
    public function index()
    {
        return response()->json(StudentsModel::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nis_student' => 'required|string',
            'name' => 'required|string',
            'id_class' => 'required|integer'
        ]);

        $data['created_at'] = now();
        $data['edited_at'] = now();

        $student = StudentsModel::create($data);

        return response()->json([
            'status' => true,
            'message' => 'Student added successfully',
            'data' => $student
        ], 201);
    }

    public function show($id)
    {
        $student = StudentsModel::find($id);
        if (!$student) {
            return response()->json(['status' => false, 'message' => 'Student not exist'], 404);
        }
        return response()->json(['status' => true, 'data' => $student]);
    }

    public function update(Request $request, $id)
    {
        $student = StudentsModel::find($id);
        if (!$student) {
            return response()->json(['status' => false, 'message' => 'Student not found'], 404);
        }

        $student->update(array_merge(
            $request->only(['nis_student', 'name', 'id_class']),
            ['edited_at' => now()]
        ));

        return response()->json([
            'status' => true,
            'message' => 'Student updated successfully',
            'data' => $student
        ], 201);
    }

    public function destroy($id)
    {
        $student = StudentsModel::find($id);
        if (!$student) {
            return response()->json(['status' => false, 'message' => 'Student not found'], 404);
        }
        $student->delete();
        return response()->json(['status' => true, 'message' => 'Student deleted successfully'], 201);
    }
}