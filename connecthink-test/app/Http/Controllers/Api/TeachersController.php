<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TeacherModel;
use App\Models\TeacherClassModel;
use App\Models\ClassModel;

class TeachersController extends Controller
{
    public function index()
    {
        $data = TeacherModel::with('classRelation')->get();
        return response()->json($data);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nip_teacher' => 'required|string',
            'name' => 'required|string',
            'id_class' => 'required|exists:table_class,id_class',
        ]);

        $timestamp = now();

        $teacher = TeacherModel::create([
            'nip_teacher' => $data['nip_teacher'],
            'name' => $data['name'],
            'created_at' => $timestamp,
            'edited_at' => $timestamp,
        ]);

        TeacherClassModel::create([
            'id_teacher' => $teacher->id_teacher,
            'id_class' => $data['id_class'],
            'created_at' => $timestamp,
            'edited_at' => $timestamp,
        ]);

        return response()->json(['status' => true, 'message' => 'Teacher added successfully!'], 201);
    }

    public function show($id)
    {
        $teacher = TeacherModel::with('classRelation')->find($id);

        if (!$teacher) {
            return response()->json(['status' => false, 'message' => 'Teacher not found'], 404);
        }

        return response()->json(['status' => true, 'data' => $teacher]);
    }

    public function update(Request $request, $id)
    {
        $teacher = TeacherModel::find($id);

        if (!$teacher) {
            return response()->json(['status' => false, 'message' => 'Teacher not found'], 404);
        }

        $data = $request->validate([
            'nip_teacher' => 'required|string',
            'name' => 'required|string',
            'id_class' => 'required|exists:table_class,id_class',
        ]);

        $timestamp = now();

        $teacher->update([
            'nip_teacher' => $data['nip_teacher'],
            'name' => $data['name'],
            'edited_at' => $timestamp,
        ]);

        TeacherClassModel::where('id_teacher', $teacher->id_teacher)->update([
            'id_class' => $data['id_class'],
            'edited_at' => $timestamp,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Teacher updated successfully',
            'data' => $teacher
        ], 200);
    }

    public function destroy($id)
    {
        $teacher = TeacherModel::find($id);

        if (!$teacher) {
            return response()->json(['status' => false, 'message' => 'Teacher not found'], 404);
        }

        TeacherClassModel::where('id_teacher', $teacher->id_teacher)->delete();
        $teacher->delete();

        return response()->json([
            'status' => true,
            'message' => 'Teacher deleted successfully'
        ], 200);
    }
}
