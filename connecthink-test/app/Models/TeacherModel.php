<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\TeacherClassModel;

class TeacherModel extends Model
{
    protected $table = 'table_teachers';
    protected $primaryKey = 'id_teacher';
    public $timestamps = false;

    protected $fillable = ['nip_teacher', 'name', 'created_at', 'edited_at'];

    public function classRelation()
    {
        return $this->hasOne(TeacherClassModel::class, 'id_teacher', 'id_teacher')
                    ->with('classDetail');
    }
}
