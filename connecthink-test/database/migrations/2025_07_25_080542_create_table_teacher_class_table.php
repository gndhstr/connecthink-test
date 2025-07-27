<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('table_teacher_class', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('id_teacher')->nullable();
            $table->foreign('id_teacher')->references('id_teacher')->on('table_teachers')->onDelete('set null');
            $table->unsignedInteger('id_class')->nullable();
            $table->foreign('id_class')->references('id_class')->on('table_class')->onDelete('set null');
            $table->dateTime('created_at');
            $table->dateTime('edited_at');
        });

        Schema::enableForeignKeyConstraints();
    }


    public function down(): void
    {
        Schema::dropIfExists('table_teacher_class');
    }
};
