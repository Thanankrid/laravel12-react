<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\WeightController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';

Route::get('/test', function () {
    return Inertia::render('Test');
})->name('test');


Route::get('/tictactoe', function () {
    return Inertia::render('Tictactoe');
})->name('tictactoe');

Route::get('/fruit', function () {
    return Inertia::render('Fruit');
})->name('fruit');


Route::get('/hello-teacher', function () {
    return Inertia::render('HelloTeacher');
})->name('hello-teacher');

Route::middleware(['auth', 'check.role:admin,teacher,guest'])->group(function () {
    Route::get('/teacher', function () {
        return Inertia::render('HelloTeacher');
    });
});


Route::get('/about-page', function () {
    return Inertia::render('AboutPage');
})->name('about-page');


Route::get('/home-page', function () {
    return Inertia::render('HomePage');
})->name('home-page');


Route::get('/bootstrap', function () {
    return Inertia::render('BootstrapContent');
})->name('bootstrap');

//routes/web.php
Route::get('/circle', function () {
    return Inertia::render('Circle');
})->name('circle');

//routes/web.php
Route::get('/counter', function () {
    return Inertia::render('Counter');
})->name('counter');

//routes/web.php
Route::get('/form-example', function () {
    return Inertia::render('FormExample');
})->name('form-example');

//routes/web.php
Route::get('/list-manager', function () {
    return Inertia::render('ListManager');
})->name('list-manager');

//routes/web.php
Route::get('/infinite-scroll', function () {
    return Inertia::render('InfiniteScrollExample');
})->name('infinite-scroll');

Route::get('/quiz3', function () {
    return Inertia::render('Quiz3');
})->name('quiz3');

// routes/web.php
use App\Models\Product;

Route::get('/product', function () {
    $products = Product::all();
    return Inertia::render('ProductList', compact('products'));
})->name('product');

// routes/web.php
Route::get('/product-others', function () {
    return Inertia::render('ProductOthers');
})->name('product-others');

// Route Web ตามที่โจทย์กำหนด
Route::get('/quiz4', function () {
    return Inertia::render('Quiz4');
})->name('quiz4');

Route::get('/product-manager', function () {
    $p = Product::all();
    return Inertia::render('ProductManager', compact('p'));
})->name('product-manager');

Route::get('/product/create', function () {
    return Inertia::render('ProductForm');
})->name('product.create');

Route::get('/product/{id}/edit', function ($id) {
    $product = Product::findOrFail($id);
    return Inertia::render('ProductForm', compact('product'));
})->name('product.edit');


// สร้าง Route ครบทุก Action (index, create, store, edit, update, destroy)
Route::resource('weights', WeightController::class);



// ==========================================
// Maintenance Request System
// ==========================================

Route::middleware('auth')->group(function () {

    Route::get('/maintenance', function () {
        return Inertia::render('Maintenance/Dashboard');
    })->name('maintenance.dashboard');

    Route::get('/maintenance/requests', function () {
        return Inertia::render('Maintenance/Requests/Index');
    })->name('maintenance.requests.index');

    Route::get('/maintenance/requests/create', function () {
        return Inertia::render('Maintenance/Requests/Create');
    })->name('maintenance.requests.create');

    Route::get('/maintenance/requests/{id}', function ($id) {
        return Inertia::render('Maintenance/Requests/Show', [
            'requestId' => $id,
        ]);
    })->name('maintenance.requests.show');

    Route::get('/maintenance/technicians', function () {
        return Inertia::render('Maintenance/Technicians/Index');
    })->name('maintenance.technicians.index');

    Route::get('/maintenance/invoices', function () {
        return Inertia::render('Maintenance/Invoices/Index');
    })->name('maintenance.invoices.index');

    Route::get('/maintenance/requests/{id}/edit', function ($id) {
        return Inertia::render('Maintenance/Requests/Edit', [
            'requestId' => $id,
        ]);
    })->name('maintenance.requests.edit');

    Route::get('/maintenance/invoices/{id}', function ($id) {
        return Inertia::render('Maintenance/Invoices/Show', [
            'invoiceId' => $id
        ]);
    })->name('maintenance.invoices.show');

    Route::get('/maintenance/invoices/{id}/pay', function ($id) {
        return Inertia::render('Maintenance/Invoices/Pay', [
            'invoiceId' => $id
        ]);
    })->name('maintenance.invoices.pay');

    Route::get('/maintenance/settings', function () {
        return Inertia::render('Maintenance/Settings/Index');
    })->name('maintenance.settings');


    Route::get('/maintenance/profile', function () {
        return Inertia::render('Maintenance/Profile');
    })->name('maintenance.profile');
});
