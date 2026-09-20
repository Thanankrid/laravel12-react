<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaintenanceMessage extends Model
{
    protected $fillable = [
        'maintenance_request_id',
        'user_id',
        'body',
    ];

    public function request()
    {
        return $this->belongsTo(
            MaintenanceRequest::class,
            'maintenance_request_id'
        );
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
