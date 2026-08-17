<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\ProductController;

Route::get('/components', function () {
    $components = DB::table('iot_components')->get();
    return response()->json($components);
});

Route::apiResource('/product', ProductController::class);