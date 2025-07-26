<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ClassModel;

class ClassController extends Controller
{
    public function index()
    {
        return response()->json(ClassModel::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name_class' => 'required|string',
        ]);

        $data['created_at'] = now();
        $data['edited_at'] = now();

        $class = ClassModel::create($data);

        return response()->json([
            'status' => true,
            'message' => 'class added successfully',
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
            return response()->json(['status' => false, 'message' => 'class not found'], 404);
        }
    
        $request->validate([
            'name_class' => 'required|string|max:255',
        ]);
    
        $class->update([
            'name_class' => $request->input('name_class'),
            'edited_at' => now(),
        ]);
    
        return response()->json([
            'status' => true,
            'message' => 'class updated successfully',
            'data' => $class
        ], 200);
    }    

    public function destroy($id)
    {
        try {
            $class = ClassModel::findOrFail($id);
            if ($class->students()->exists() || $class->teachers()->exists()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Tidak bisa menghapus kelas karena masih memiliki relasi data'
                ], 422);
            }
            
            $class->delete();
            
            return response()->json([
                'status' => true,
                'message' => 'Class deleted successfully'
            ]);
            
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Gagal menghapus karena data terkait',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
