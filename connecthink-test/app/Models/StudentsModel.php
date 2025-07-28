<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ClassModel;

class StudentsModel extends Model
{
    protected $table = 'table_students';
    public $timestamps = false;

    protected $fillable = [
        'nis_student',
        'name',
        'id_class',
        'created_at',
        'edited_at',
    ];

    public function class()
    {
        return $this->belongsTo(ClassModel::class, 'id_class');
    }
}