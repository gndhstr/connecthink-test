<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ClassModel;
use App\Models\TeacherClassModel;
use App\Models\StudentsModel;


class ClassController extends Controller
{
    public function index()
    {
        return response()->json(ClassModel::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name_class' => 'required|string|unique:table_class,name_class',
        ], [
            'name_class.unique' => 'Class name already exist.',
        ]);

        $data['created_at'] = now();
        $data['edited_at'] = now();
    
        $class = ClassModel::create($data);
    
        return response()->json([
            'status' => true,
            'message' => 'Class added successfully',
            'data' => $class
        ], 201);
    }    

    public function show($id)
    {
        $class = ClassModel::find($id);
        if (!$class) {
            return response()->json(['status' => false, 'message' => 'class not exist'], 404);
        }
        return response()->json(['status' => true, 'data' => $class]);
    }

public function update(Request $request, $id)
{
    $class = ClassModel::find($id);
    if (!$class) {
        return response()->json(['status' => false, 'message' => 'Class not found'], 404);
    }

    $request->validate([
        'name_class' => 'required|string|unique:table_class,name_class,' . $id . ',id_class',
    ], [
        'name_class.unique' => 'Class name already exist.',
    ]);

    $class->update([
        'name_class' => $request->input('name_class'),
        'edited_at' => now(),
    ]);

    return response()->json([
        'status' => true,
        'message' => 'Class updated successfully',
        'data' => $class
    ], 200);
}


    public function destroy($id)
    {
        StudentsModel::where('id_class', $id)->update(['id_class' => null]);
        TeacherClassModel::where('id_class', $id)->delete();

        $class = ClassModel::find($id);
        if ($class) {
            $class->delete();
        }
    
        return response()->json(['message' => 'Kelas dan relasinya berhasil dihapus']);
    }
    
}
