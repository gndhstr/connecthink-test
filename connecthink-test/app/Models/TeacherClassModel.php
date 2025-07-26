<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeacherClassModel extends Model
{
    protected $table = 'table_teacher_class';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = ['id_teacher', 'id_class', 'created_at', 'edited_at'];

    public function classDetail()
    {
        return $this->belongsTo(ClassModel::class, 'id_class', 'id_class');
    }
}
