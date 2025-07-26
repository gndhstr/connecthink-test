<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
        return $this->hasMany(StudentsModel::class, 'id_class', 'id_class');
    }
    public function teachers()
    {
        return $this->belongsToMany(Teacher::class, 'class_teacher', 'class_id', 'teacher_id');
    }
}

