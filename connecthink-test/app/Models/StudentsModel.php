<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentsModel extends Model
{
    protected $table = 'table_students';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'name',
        'nis_student',
        'id_class',
        'created_at',
        'edited_at'
    ];

    public function class()
    {
        return $this->belongsTo(ClassModel::class, 'id_class', 'id_class');
    }
}