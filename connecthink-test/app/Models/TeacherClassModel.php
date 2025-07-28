<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ClassModel;
use App\Models\TeacherModel;

class TeacherClassModel extends Model
{
    protected $table = 'table_teacher_class';
    public $timestamps = false;

    protected $fillable = [
        'id_teacher',
        'id_class',
        'created_at',
        'edited_at',
    ];

    public function classDetail()
    {
        return $this->belongsTo(ClassModel::class, 'id_class');
    }
    
    public function teacher()
    {
        return $this->belongsTo(TeacherModel::class, 'id_teacher');
    }
}
