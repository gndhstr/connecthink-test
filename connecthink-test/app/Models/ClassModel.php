<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\StudentsModel;
use App\Models\TeacherClassModel;

class ClassModel extends Model
{
    protected $table = 'table_class';
    protected $primaryKey = 'id_class';
    public $timestamps = false;

    protected $fillable = [
        'name_class',
        'created_at',
        'edited_at',
    ];

    public function students()
    {
        return $this->hasMany(StudentsModel::class, 'id_class');
    }

    public function teacherClasses()
    {
        return $this->hasMany(TeacherClassModel::class, 'id_class');
    }
}
