<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceInvoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_no',
        'maintenance_request_id',
        'labor_cost',
        'parts_cost',
        'total_amount',
        'payment_status',
        'paid_at',
        'payment_method',
        'payment_ref',
        'note',
        'issued_at',
    ];

    protected $casts = [
        'issued_at' => 'date',
        'paid_at' => 'datetime',
    ];

    public function request()
    {
        return $this->belongsTo(
            MaintenanceRequest::class,
            'maintenance_request_id'
        );
    }

    public function items()
    {
        return $this->hasMany(
            MaintenanceInvoiceItem::class,
            'maintenance_invoice_id'
        );
    }
}