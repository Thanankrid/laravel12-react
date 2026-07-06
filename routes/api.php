<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/components', function () {
    $components = DB::table('iot_components')->get();
    return response()->json($components);
});