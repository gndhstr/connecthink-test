<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('table_teachers', function (Blueprint $table) {
            $table->increments('id_teacher');
            $table->bigInteger('nip_teacher');
            $table->string('name');
            $table->dateTime('created_at');
            $table->dateTime('edited_at');
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('table_teachers');
    }
};
